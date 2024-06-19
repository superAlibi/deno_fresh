import { encodeBase64 } from "$std/encoding/base64.ts";
import { Button } from "../components/Button.tsx";
import { effect, signal } from "@preact/signals";
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
            name: "SHA-512" // 这边如果后端使用公钥加密，要注意与前端一致
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
    console.log(keyInfo.value?.publicKey);
    
    crypto.subtle.exportKey("pkcs8", keyInfo.value.publicKey)
      .then((k) => {
        console.log(k);
        
        publickey.value = encodeBase64(k);
      },e=>{
        console.error(e);
        
      });
  });
  const aeskey = signal("");
  function getKey() {
    const url = new URL("/api/common");
    url.searchParams.append("publickey", publickey.value);
    fetch(url).then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        aeskey.value = data;
      });
  }
  return (
    <div>
      <div>
        <label htmlFor="publickey">
          <textarea disabled={true} id="publickey" >
            {publickey}
          </textarea>
        </label>
      </div>
      <div>
        <label htmlFor="aeskey">
          <textarea disabled={true} id="aeskey" value={aeskey.value}>
          </textarea>
        </label>
      </div>
      <Button disabled={gening} onClick={gen}>生成key</Button>
      <Button disabled={!publickey.value} onClick={getKey}>
        获得server secret key
      </Button>
    </div>
  );
};
