import { decodeBase64, encodeBase64 } from "$std/encoding/base64.ts";
import { Button } from "../components/Button.tsx";
import { computed,  signal } from "@preact/signals";
import { useRef } from "preact/hooks";

import {
  createRequestInterceptor,
  createResponseInterceptor,
  http,
  HTTPTool,
} from "../tools/http.ts";
import { RSAOAEP } from "../tools/crypto/rsa.ts";
import { AESCBC } from "../tools/crypto/aes.ts";
type RespType = {
  data: string;
  message?: string;
};
const commonServer = new HTTPTool("/api/");

export const GenKeyAndGetAes = () => {
  const rsa = useRef(new RSAOAEP());
  const gening = signal(false);
  const publickey = signal("");
  function gen() {
    gening.value = true;
    rsa.current.exportPublicKey().then((key) => {
      gening.value = false;
      publickey.value = encodeBase64(key);
    });
  }

  const aeskey = signal<Uint8Array | null>(null);
  const b64AESKey = computed(() =>
    aeskey.value ? encodeBase64(aeskey.value) : ""
  );
 
  function getKey() {
    commonServer.get<RespType>("common", { params: { pk: publickey.value } })
      .then((resp) => {
        const ciphertext = decodeBase64(resp.data);
        rsa.current.decrypt(ciphertext).then((v) => {
          aeskey.value = new Uint8Array(v);
          const aes = new AESCBC(v);
          http.options.requestInterceptor = createRequestInterceptor(aes);
          http.options.responseInterceptor = createResponseInterceptor(aes);
        });
      });
  }
  const textarearef = useRef<HTMLTextAreaElement>(null);


  const outputValue = useRef<HTMLTextAreaElement>(null);
  function optionSend() {
    console.log("长江发送");
    http.option("/common", {
      data:{data: textarearef.current!.value},
    }).then((resp) => {
      outputValue.current!.value = JSON.stringify(resp);
      return resp as RespType;
    }).then((resp) => {
      console.log(resp); 
    }).catch(e=>{
      console.trace(e);
    })
  }
  function postSend() {
    console.log("长江发送");
    http.post("/common", {
      data:{data: textarearef.current!.value},
    }).then((resp) => {
      outputValue.current!.value = JSON.stringify(resp);
      return resp as RespType;
    }).then((resp) => {
      console.log(resp); 
    }).catch(e=>{
      console.trace(e);
    })
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
        <Button title="返回的数据将不会加密" onClick={optionSend}>发送加密数据(OPTION)</Button>
        <Button title="返回的数据将会加密" onClick={postSend}>发送加密数据(POST)</Button>
      </div>
    </div>
  );
};
