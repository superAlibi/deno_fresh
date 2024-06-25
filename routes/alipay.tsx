import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET() {
    const appid = Deno.env.get("ALIPAY_APPID");
    const location = Deno.env.get("location")!;
    const urlobj = new URL(location);
    urlobj.pathname = "/api/alipay/auth_code";
    const authURLObj = new URL(
      "https://openauth.alipay.com/oauth2/publicAppAuthorize.htm",
    );
    authURLObj.searchParams.set("app_id", appid as string);
    authURLObj.searchParams.set("scope", "auth_user");
    authURLObj.searchParams.set(
      "redirect_uri",
      encodeURIComponent(urlobj.toString()),
    );
    authURLObj.searchParams.set("state", "admin");

    return new Response("", {
      status: 302,
      headers: {
        Location: authURLObj.toString(),
      },
    });
  },
};
