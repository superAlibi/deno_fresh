import { decodeBase64, encodeBase64 } from "$std/encoding/base64.ts";
import { Button } from "../components/Button.tsx";
import { computed, effect, signal } from "@preact/signals";
import { useRef } from "preact/hooks";
type RespType = {
  data: string;
  message?: string;
};
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
          name: "SHA-512", // 这边如果后端使用公钥加密，要注意与前端一致
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
  const aeskey = signal<Uint8Array>(new Uint8Array(32));
  const b64AESKey = computed(() => encodeBase64(aeskey.value));
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
  function send() {
    /* crypto.subtle.encrypt({
      name:''
    }) */
  }
  return (
    <div>
      <div>
        <label htmlFor="publickey">
          公钥
          <textarea class="w-full" rows={6} disabled={true} id="publickey">
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
        <label htmlFor="inputValue">

        <textarea id="inputValue" ref={textarearef}></textarea>

        </label>
        <Button onClick={send}>发送加密数据</Button>
      </div>
    </div>
  );
};
