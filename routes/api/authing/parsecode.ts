import { Handlers } from "$fresh/server.ts";
import { ParsedCTX } from "../../../types.d.ts";
// import { resumeAuhtingSDK } from "../../tools/sdk/authing.ts";

export const handler: Handlers<ParsedCTX> = {
  GET(req, ctx) {
    // resumeAuhtingSDK.getA
    const code = ctx.data.query.get("code");
    if (!code) {
      return new Response(JSON.stringify({
        code: 400,
        message: "code is required",
      }));
    }
    const state = ctx.data.query.get("state");
    // 认证参数拼装
    const urlObj = new URL("https://worker-xjm-resume.authing.cn/oidc/token");
    const { searchParams } = urlObj;
    searchParams.append("code", code);
    searchParams.append("client_id", Deno.env.get("AUTHING_APP_ID")!);
    searchParams.append("client_secret", Deno.env.get("AUTHING_SECRET_KEY")!);
    searchParams.append("grant_type", "authorization_code");
    // 重定向地址
    const redirect_uri = new URL(Deno.env.get("location")!);
    redirect_uri.pathname = "/api/authing/parsecode";
    searchParams.append("redirect_uri", redirect_uri.toString());
    console.log(urlObj.toString());

    fetch(urlObj, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }).then((RESP) => {
      return RESP.json();
    }).then((d) => {
      console.log(JSON.stringify(d));
    });
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
