import { Handler } from "$fresh/server.ts";
import { deleteCookie, getCookies, setCookie } from "$std/http/mod.ts";
import dayjs from "npm:dayjs@latest";
const witeList = ["/admin/login"];

export const handler: Handler = async (req, ctx) => {
  const url = new URL(req.url);
  if (witeList.includes(url.pathname)) {
    return ctx.next();
  }

  const headers = new Headers();

  const newDate = dayjs();
  // ctx.state.userInfo =
  ctx.state.query = new URL(req.url).searchParams;
  const resp = await ctx.next();
  // 重写cookie,保持在线
  const values = getCookies(resp.headers);

  return resp;
};
