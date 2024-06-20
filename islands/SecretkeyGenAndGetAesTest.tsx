import { decodeBase64, encodeBase64 } from "$std/encoding/base64.ts";
import { Button } from "../components/Button.tsx";
import { computed, effect, signal } from "@preact/signals";
import { useRef } from "preact/hooks";
import user from "../routes/admin/user.tsx";
type RespType = {
  data: string;
  message?: string;
};
const encoder = new TextEncoder(), textDecoder = new TextDecoder();
export const GenKeyAndGetAes = () => {
  const keyInfo = signal<CryptoKeyPair | null>(null);
  const gening = signal(false);

  function gen() {
    gening.value = true;
    crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",

        modulusLength: 2048,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: {
          name: "SHA-256",
        },
      },
      true,
      ["encrypt", "decrypt"],
    ).then((key) => {
      console.log(key);

      gening.value = false;
      keyInfo.value = key;
    });
  }
  const publickey = signal("");
  effect(() => {
    if (!keyInfo.value?.publicKey) {
      return;
    }

    crypto.subtle.exportKey("spki", keyInfo.value.publicKey)
      .then((k) => {
        console.log(k);
        console.log(encodeBase64(k));

        publickey.value = encodeBase64(k);
      }, (e) => {
        console.error(e);
      });
  });
  const aeskey = signal<Uint8Array | null>(null);
  const b64AESKey = computed(() =>
    aeskey.value ? encodeBase64(aeskey.value) : ""
  );
  function getKey() {
    const url = new URL("/api/common", location.href);
    url.searchParams.set("pk", publickey.value);

    fetch(url).then((resp) => resp.json())
      .then((resp: RespType) => {
        console.log(resp);

        const ciphertext = decodeBase64(resp.data);
        crypto.subtle.decrypt(
          { name: "RSA-OAEP" },
          keyInfo.value!.privateKey,
          ciphertext,
        ).then((v) => {
          console.log(v);
          aeskey.value = new Uint8Array(v);
        });
      });
  }
  const textarearef = useRef<HTMLTextAreaElement>(null);
  const serverSecret = signal<CryptoKey | null>(null);
  effect(() => {
    if (!aeskey.value) {
      return;
    }
    crypto.subtle.importKey(
      "raw",
      aeskey.value.buffer,
      "AES-CBC",
      false,
      ["encrypt", "decrypt"],
    ).then((key) => {
      serverSecret.value = key;
    });
  });
  const outputValue = useRef<HTMLTextAreaElement>(null);
  function send() {
    if (!serverSecret.value) {
      return console.log("长江发送异常");
    }
    console.log("长江发送");

    const iv = crypto.getRandomValues(new Uint8Array(16));
    crypto.subtle.encrypt(
      { name: "AES-CBC", iv },
      serverSecret.value!,
      encoder.encode(textarearef.current!.value),
    ).then((v) => {
      return fetch("/api/common", {
        method: "POST",
        body: JSON.stringify({
          data: encodeBase64(v),
          iv: encodeBase64(iv),
        }),
      });
    }).then(async (resp) => {
      const text = await resp.text();
      outputValue.current!.value = text;
      return JSON.parse(text) as RespType;
    }).then((resp) => {
      console.log(resp);

      /* const bin = decodeBase64(resp.data);
      crypto.subtle.decrypt({ name: "AES-CBC", iv }, serverSecret.value!, bin)
        .then((d) => textDecoder.decode(d))
        .then((data) => {
          console.log(data);
        }); */
    });
  }
  return (
    <div>
      <div>
        <label htmlFor="publickey">
          公钥
          <textarea class="w-full" rows={3} disabled={true} id="publickey">
            {publickey}
          </textarea>
        </label>
      </div>
      <div>
        <label htmlFor="aeskey">
          服务器 aes key
          <textarea class="w-full" disabled={true} id="aeskey">
            {b64AESKey}
          </textarea>
        </label>
      </div>
      <Button disabled={gening} onClick={gen}>生成key</Button>
      <Button disabled={!publickey} onClick={getKey}>
        获得server secret key
      </Button>
      <div>
        <div>
          <label htmlFor="inputValue">
            需要加密的信息
            <textarea class="w-full" id="inputValue" ref={textarearef}>
            </textarea>
          </label>
        </div>
        <div>
          <label htmlFor="outputValue">
            黄河回应
            <textarea
              class="w-full"
              id="outputValue"
              ref={outputValue}
              disabled={true}
            >
            </textarea>
          </label>
        </div>
        <Button onClick={send}>发送加密数据</Button>
      </div>
    </div>
  );
};
