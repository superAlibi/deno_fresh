import { Handler } from "$fresh/server.ts";
import { deleteCookie, getCookies, setCookie } from "$std/http/mod.ts";
import { DeleteToken, GetTokenInfo, SetTokenInfo } from "../../denokv/user.ts";
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
    await DeleteToken([result.token]);
    deleteCookie(headers, "t");
    headers.set("location", "/admin/login");
    return new Response(JSON.stringify("令牌过期"), {
      status: 302,
      headers,
    });
  }
  const newDate = dayjs();
  // 只要有请求,都算自动续期
  result.renewal = newDate.toISOString();
  SetTokenInfo(result).then(({ ok }) => {
    if (!ok) {
      console.error(`admin/token:${token} 续期失败`);
    }
  });
  ctx.state.userInfo = result.accountInfo;
  ctx.state.query = new URL(req.url).searchParams;
  const resp = await ctx.next();
  // 重写cookie,保持在线
  /* setCookie(resp.headers, {
    name: "t",
    value: token,
    expires: newDate.add(result.maxAge, result.ageUnit).toDate(),
    path: "/admin",
    httpOnly: true,
  }); */
  return resp;
};
