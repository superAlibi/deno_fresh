import { Handlers } from "$fresh/server.ts";
import { alipaySdk } from "../../../tools/sdk/alipay.ts";
import { ParsedReqInfo } from "../_middleware.ts";

export const handler: Handlers<ParsedReqInfo> = {
  async GET(req, ctx) {
    const state = ctx.data.query.get("state");
    if (!state) {
      return new Response(JSON.stringify({message:'无效的响应'}), { status: 403 });
    }
    const auth_code = ctx.data.query.get("auth_code");
    const app_id = ctx.data.query.get("app_id");
    const scope = ctx.data.query.get("scope");
    console.log(req.url);
    const resut = await alipaySdk.exec("alipay.system.oauth.token", {
      code: auth_code,
      grant_type: "authorization_code",
    });
    console.log(JSON.stringify(resut));
    
    return new Response("Hello World");
  },
};
