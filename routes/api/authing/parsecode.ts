import { Handlers } from "$fresh/server.ts";
import { setRefreshToken } from "../../../denokv/user.ts";
import { storeUserInfo } from "../../../denokv/user.ts";
import { getResumeAuthingSDK } from "../../../tools/sdk/authing.ts";
import { ParsedCTX } from "../../../types.d.ts";
export const handler: Handlers<ParsedCTX> = {
  GET(req, ctx) {
    const code = ctx.data.query.get("code");
    if (!code) {
      return new Response(JSON.stringify({
        code: 400,
        message: "code is required",
      }));
    }
    const sdk = getResumeAuthingSDK();

    // 认证参数拼装
    return sdk.getAccessTokenByCode(code).then((result) => {
      setRefreshToken(result.refresh_token);
      sdk.getUserInfoByAccessToken(result.id_token)
        .then((resp) => {
          return storeUserInfo(result.id_token, resp);
        });
      return new Response(JSON.stringify(result));
    }, (e) => {
      console.error(e.message);

      return new Response("页面出错,", { status: 500 });
    });
  },
};
