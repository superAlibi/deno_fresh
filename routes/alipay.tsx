import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET() {
    const appid = Deno.env.get("ALIPAY_APPID");
    // /api/alipay/redirect.ts
    console.log(location?.host);
    const urlobj = new URL(location?.href);
    urlobj.pathname = "/api/alipay/redirect";
    return new Response("", {
      status: 302,
      headers: {
        Location:
          `https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=${appid}&scope=auth_user&redirect_uri=${encodeURIComponent(urlobj.toString())}`,
      },
    });
  },
};
