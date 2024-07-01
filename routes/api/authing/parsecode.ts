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
    const state = ctx.data.query.get("state");
    // 认证参数拼装
    const result = getResumeAuthingSDK().getAccessTokenByCode(code);
    console.log(result);
    return new Response(JSON.stringify(ctx.data.query.toString()));
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
