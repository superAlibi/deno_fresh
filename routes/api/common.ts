import { Handlers } from "$fresh/server.ts";
import { decodeBase64, encodeBase64 } from "$std/encoding/base64.ts";
import { getServerSecretKey } from "../../denokv/serverkey.ts";
export let serverCryptoKey: CryptoKey;
export const decoder = new TextDecoder();
export const handler: Handlers = {
  GET(req) {
    const pk = new URL(req.url).searchParams.get("pk");

    if (!pk) {
      return new Response(
        JSON.stringify({ message: "publickey is required" }),
        {
          status: 400,
        },
      );
    }
    // 将publickey解析
    const parsedPublickKey = decodeBase64(pk);
    if (!parsedPublickKey) {
      return new Response(JSON.stringify({ message: "Invalid public key" }), {
        status: 400,
      });
    }

    // 解析public key
    return crypto.subtle.importKey(
      "spki",
      parsedPublickKey,
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      true,
      ["encrypt"],
    ).then(async (key) => {
      // 给出服务器aeskey并通过publickey加密aeskey
      const serverKey = await getServerSecretKey();
      crypto.subtle.importKey(
        "raw",
        serverKey,
        { name: "AES-CBC", length: 128 },
        true,
        ["encrypt", "decrypt"],
      )
        .then((k) => serverCryptoKey = k);
      return crypto.subtle.encrypt(
        {
          name: "RSA-OAEP",
        },
        key,
        serverKey,
      );
    }).then((ciphertext) => {
      // 将通过publickey加密过得aeskey返回给客户端
      const u8arry = new Uint8Array(ciphertext);
      return new Response(JSON.stringify({ data: encodeBase64(u8arry) }));
    }).catch((e) => {
      console.error(e);
      return new Response(
        JSON.stringify({ message: "Invalid public key" }),
        {
          status: 400,
        },
      );
    });
  },
  POST(req) {
    console.log("黄河收到");

    return req.json().then(({ data, iv }) => {
      const bindate = decodeBase64(data);
      const biniv = decodeBase64(iv);
      if (!bindate || !biniv) {
        return new Response(
          JSON.stringify({ message: "Invalid parameter" }),
          {
            status: 400,
          },
        );
      }
      return crypto.subtle.decrypt(
        { name: "AES-CBC", iv: biniv },
        serverCryptoKey,
        bindate,
      ).then((d) => {
        const data = decoder.decode(d);
        const parsedData = JSON.parse(data);
        return new Response(JSON.stringify({ ...parsedData, message: "ok" }));
      });
    }).catch((e) => {
      console.error(e);
      return new Response(JSON.stringify({ message: "Invalid ciphertext" }), {
        status: 500,
      });
    });
  },
};
