import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET() {
    const appid = Deno.env.get("ALIPAY_APPID");
    const privateKey = Deno.env.get("APP_PRIVATE_KEY");
    const publickey = Deno.env.get("ALIPAY_PUBLIC_KEY");
    console.log(privateKey);
    console.log("卧槽");

    console.log(publickey);

    const location = Deno.env.get("location")!;
    console.log(location);

    const urlobj = new URL(location);
    urlobj.pathname = "/api/alipay/auth_code";
    const authURLObj = new URL(
      "https://openauth.alipay.com/oauth2/publicAppAuthorize.htm",
    );
    authURLObj.searchParams.set("app_id", appid as string);
    authURLObj.searchParams.set("scope", "auth_user");
    authURLObj.searchParams.set(
      "redirect_uri",
      urlobj.toString(),
    );
    authURLObj.searchParams.set("state", "admin");
    console.log(authURLObj.toString());

    return new Response("", {
      status: 302,
      headers: {
        Location: authURLObj.toString(),
      },
    });
  },
};
