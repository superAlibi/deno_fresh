import { FreshContext } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import { decodeBase64 } from "$std/encoding/base64.ts";
import { CurrentAES } from "../../tools/crypto/server.ts";
import { ParsedCTX } from "../../types.d.ts";

// 接口白名单列表
const whiteList = [
  "/api/common",
  "/api/common",
  "/api/usercenter/login.account",
  "/api/joke",
  "/api/resume",
  "/api/sse",
  "/api/test",
  "/api/whitelist/wx",
  "/api/alipay/auth_code",
  "/api/alipay/notify",
  "/api/authing/parsecode",
  "/api/authing/access_token",
];
// 加密排除名单列表
const encryptExcludeList: string[] = [];
const nobodymethods = ["GET", "HEAD"];
const decoder = new TextDecoder();
export async function handler(
  req: Request,
  ctx: FreshContext<ParsedCTX>,
) {
  const urlObj = new URL(req.url);
  if (nobodymethods.some((i) => req.method === i)) {
    ctx.data = {
      reqbody: {},
      query: urlObj.searchParams,
    };
  } else {
    const data = {
      reqbody: await req.clone().json(),
      query: urlObj.searchParams,
    };

    ctx.data = data;
  }

  // 白名单列表
  if (whiteList.includes(urlObj.pathname)) {
    const resp = await ctx.next();
    return resp;
  }
  const cookies = getCookies(req.headers);

  if (!cookies["t"]) {
    console.warn("没有访问令牌");
  }

  if (encryptExcludeList.includes(urlObj.pathname)) {
    const resp = await ctx.next();
    resp.headers.append("Content-Type", "application/json");
    return resp;
  }

  const { data, iv } = ctx.data.reqbody;

  return CurrentAES.decrypt(decodeBase64(data), decodeBase64(iv))
    .then((plaintext) => {
      const info = decoder.decode(plaintext);
      ctx.data.reqbody = JSON.parse(info);
    }).then(async () => {
      const resp = await ctx.next();

      return resp;
    });
}
