import { Handlers } from "$fresh/server.ts";
import { getCookies, setCookie } from "$std/http/mod.ts";
import { encodeBase64 } from "$std/encoding/base64.ts";
import dayjs from "npm:dayjs@latest";
import { GetUserInfo, UpdateUserInfo } from "../../../denokv/user/index.ts";
import { SetTokenInfo } from "../../../denokv/index.ts";
import { TokenInfo } from "../../../denokv/index.ts";
import { DeleteToken } from "../../../denokv/index.ts";
export interface CmmitInfo {
  acc: string;
  pwd: string;
}
UpdateUserInfo;
export interface LoginForm {
  username: string;
  password: string;
}
// const fileENV = await load();

export const handler: Handlers = {
  async POST(req, _ctx) {
    const form: CmmitInfo = await req.json();
    const randomArr = crypto.getRandomValues(new Uint8Array(16));
    const info = await GetUserInfo(form.acc);
    // 密码不正确
    if (info?.password != form.pwd) {
      return new Response(JSON.stringify("密码或账号错误"), {
        status: 400,
      });
    }
    const newHeader = new Headers();
    newHeader.set("content-type", "applicationi/json");
    const token = encodeBase64(randomArr);
    const nowDateStr = dayjs().toDate().toISOString();
    const tokenInfo: TokenInfo = {
      maxAge: 1,
      createAt: nowDateStr,
      renewal: nowDateStr,
      token: token,
      accountInfo: info,
      ageUnit: "hour",
    };
    // 写入token信息
    const setResult = await SetTokenInfo(tokenInfo);
    if (!setResult.ok) {
      return new Response(JSON.stringify("写入登录凭证失败"), {
        status: 500,
        headers: newHeader,
      });
    }
    const odt = getCookies(req.headers);
    // 删除不用的token
    if (odt && odt["t"]) {
      DeleteToken(odt["t"]);
    }
    setCookie(newHeader, {
      name: "t",
      value: token,
      expires: dayjs().add(tokenInfo.maxAge, tokenInfo.ageUnit).toDate(),
      path: "/admin",
      httpOnly: true,
    });

    return new Response(JSON.stringify("成功"), {
      headers: newHeader,
    });
  },
};
