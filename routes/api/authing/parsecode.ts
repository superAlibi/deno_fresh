import { Handlers } from "$fresh/server.ts";
import { getResumeAuthingSDK } from "../../../tools/sdk/authing.ts";
import { ParsedCTX } from "../../../types.d.ts";

export const handler: Handlers<ParsedCTX> = {
   GET(req, ctx) {
    const code = ctx.data.query.get("code");
    if (!code) {
      return new Response(JSON.stringify({
        code: 400,
        message: "code is required",
      }));
    }
    const sdk = getResumeAuthingSDK();
    // 认证参数拼装
    return sdk.getAccessTokenByCode(code).then((result) => {
      console.log(result);
      return new Response(JSON.stringify(result));
    }, (e) => {
      console.error(e.message);

      return new Response("页面出错,", { status: 500 });
    });
  },
  POST(req, ctx) {
    ctx.data.query.forEach((value, key) => {
      console.log(key, value);
    });
    return new Response(JSON.stringify({
      code: 200,
      message: "ok",
    }));
  },
};
