import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET() {
    const appid = Deno.env.get("ALIPAY_APPID");
    const location = Deno.env.get("location")!;
    
    const urlobj = new URL(location);
    urlobj.pathname = "/api/alipay/auth_code";
    return new Response("", {
      status: 302,
      headers: {
        Location:
          `https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=${appid}&scope=auth_user&redirect_uri=${encodeURIComponent(urlobj.toString())}`,
      },
    });
  },
};
