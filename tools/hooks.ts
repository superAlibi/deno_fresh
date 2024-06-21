import { useEffect } from "preact/hooks";
import { RSAOAEP } from "./crypto/rsa.ts";
import {
  createRequestInterceptor,
  createResponseInterceptor,
  http,
  HTTPTool,
} from "./http.ts";
import { decodeBase64, encodeBase64 } from "$std/encoding/base64.ts";
import { AESCBC } from "./crypto/aes.ts";
export function useInit() {
  useEffect(() => {
    const sk = sessionStorage.getItem("sk");
    const abortCtl = new AbortController();
    if (!sk) {
      const rsa = new RSAOAEP();
      const tool = new HTTPTool("/api/");
      rsa.exportPublicKey()
        .then((key) =>
          tool.get("/common", {
            params: { pk: encodeBase64(key) },
            signal: abortCtl.signal,
          })
        ).then((d) => {
          const { data } = d as { data: string };
          rsa.decrypt(decodeBase64(data))
            .then((d) => {
              sessionStorage.setItem("sk", encodeBase64(d));
              return new AESCBC(d);
            })
            .then((aes) => {
              http.options.requestInterceptor = createRequestInterceptor(aes);
              http.options.responseInterceptor = createResponseInterceptor(aes);
            });
        });
    } else {
      const aes = new AESCBC(decodeBase64(sk));
      console.log(aes);

      http.options.requestInterceptor = createRequestInterceptor(aes);
      http.options.responseInterceptor = createResponseInterceptor(aes);
    }
    return () => {
      abortCtl.abort();
    };
  });
}
