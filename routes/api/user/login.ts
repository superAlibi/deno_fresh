import { Handlers } from "$fresh/server.ts";
import { setCookie } from "$std/http/mod.ts";
// import { load } from "$std/dotenv/mod.ts";
export interface LoginForm {
  username: string;
  password: string;
}
// const fileENV = await load();

export const handler: Handlers = {
  async POST(req, _ctx) {
    const form = await req.formData();
    const un = form.get("username"), password = form.get("password");
    console.info(`登录信息:username=${un},password=${password}`);
    const nh = new Headers(req.headers);
    setCookie(nh, {
      name: "token",
      value: "yeah",
      httpOnly: true,
      maxAge: 60,
      secure: true,
      path: "/",
    });
    nh.set("location", "/about");
    return new Response(null, {
      headers: nh,
      status: 303,
    });
  },
};
