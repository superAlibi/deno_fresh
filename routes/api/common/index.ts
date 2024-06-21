import { Handlers } from "$fresh/server.ts";
import { decodeBase64, encodeBase64 } from "$std/encoding/base64.ts";
import { getServerSecretKey } from "../../../denokv/serverkey.ts";
import { AESCBC } from "../../../tools/crypto/aes.ts";

import { RSAOAEP } from "../../../tools/crypto/rsa.ts";
import { CurrentAES } from "../../../tools/crypto/server.ts";
import { ParsedReqInfo, STDReq } from "../_middleware.ts";

const decoder = new TextDecoder(), encoder = new TextEncoder();
export const handler: Handlers<ParsedReqInfo> = {
  GET(_, ctx) {
    const pk = ctx.data.query.get("pk");

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
    return RSAOAEP.parsePublicKey(parsedPublickKey)
      .then(async (key) => {
        // 给出服务器aeskey并通过publickey加密aeskey
        const serverKey = await getServerSecretKey();
        return RSAOAEP.encrypt(key, serverKey);
      }).then((ciphertext) => {
        // 将通过publickey加密过得aeskey返回给客户端
        return new Response(JSON.stringify({ data: encodeBase64(ciphertext) }));
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
   POST(req, ctx) {
    console.log("黄河收到:", req.method);

    const { data, iv } = ctx.data.reqbody as STDReq;

    try {
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
      return CurrentAES.decrypt(bindate, biniv)
        .then((d) => {
          const data = decoder.decode(d);
          const parsedData = JSON.parse(data);
          const responsedata = JSON.stringify({ ...parsedData, message: "ok" });
          const iv = crypto.getRandomValues(new Uint8Array(16));
          return CurrentAES.encrypt(encoder.encode(responsedata), iv)
            .then((ciphertext) => {
              return new Response(JSON.stringify({
                data: encodeBase64(ciphertext),
                iv: encodeBase64(iv),
              }));
            });
        });
    } catch (e) {
      console.error(e);
      return new Response(JSON.stringify({ message: "Invalid ciphertext" }), {
        status: 400,
      });
    }
  },
  OPTIONS(req, ctx) {
    console.log("黄河收到:", req.method);
    const { data, iv } = ctx.data.reqbody as STDReq;
    try {
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
      return CurrentAES.decrypt(bindate, biniv)
        .then((d) => {
          const data = decoder.decode(d);
          const parsedData = JSON.parse(data);
          return new Response(JSON.stringify({ ...parsedData, message: "ok" }));
        });
    } catch (e) {
      console.error(e);
      return new Response(JSON.stringify({ message: "Invalid ciphertext" }), {
        status: 500,
      });
    }
  },
};
