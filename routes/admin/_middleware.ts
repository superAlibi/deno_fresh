import { Handler } from "$fresh/server.ts";
import { deleteCookie, getCookies } from "$std/http/mod.ts";
import { DeleteToken, GetTokenInfo, SetTokenInfo } from "../../denokv/index.ts";
import dayjs from "npm:dayjs@latest";
const witeList = ["/admin/login"];
export const handler: Handler = async (req, ctx) => {
  const cookies = getCookies(req.headers),
    token = cookies["t"];
  const url = new URL(req.url);
  if (witeList.includes(url.pathname)) {
    return ctx.next();
  }
  // 没有令牌
  if (!token) {
    return new Response(null, {
      status: 302,
      headers: {
        location: "/admin/login",
      },
    });
  }
  const result = await GetTokenInfo(token);
  const headers = new Headers();
  // 无效令牌
  if (!result) {
    headers.set("location", "/admin/login");
    deleteCookie(headers, "t");
    return new Response(JSON.stringify("无效凭据或凭据已失效"), {
      status: 302,
      headers,
    });
  }
  // 是否token过期
  const expiration = dayjs(result.renewal).add(result.maxAge, result.ageUnit)
    .isBefore(dayjs());
  if (expiration) {
    await DeleteToken(result.token);
    deleteCookie(headers, "t");
    headers.set("location", "/admin/login");
    return new Response(JSON.stringify("令牌过期"), {
      status: 302,
      headers,
    });
  }
  // 只要有请求,都算自动续期
  result.renewal = dayjs().toISOString();
  SetTokenInfo(result).then(({ ok }) => {
    if (!ok) {
      console.error(`admin/token:${token} 续期失败`);
    }
  });
  ctx.state.userInfo = result.accountInfo;
  const resp = await ctx.next();
  return resp;
};
