import { defineRoute, Handlers } from "$fresh/server.ts";
import { context } from "https://deno.land/x/esbuild@v0.20.2/mod.js";
import { UserInfo } from "../../../denokv/user.ts";
import { GetUserInfo } from "../../../denokv/user.ts";
import { PCTX } from "../../../types.d.ts";
import { UpdateUserInfo } from "../../../denokv/user.ts";
import { deleteCookie, setCookie } from "$std/http/cookie.ts";
type STATE = PCTX & { qu: UserInfo | null; msg?: string };
export const handler: Handlers<unknown, STATE> = {
  async GET(req, ctx) {
    const value = ctx.state.query.get("ui");
    const info = await GetUserInfo(value as string);
    ctx.state.qu = info;
    return ctx.render();
  },
  async POST(req, ctx) {
    const formdata = await req.formData();
    console.log(Object.fromEntries(formdata.entries()));

    const uuid = formdata.get("uuid") as string,
      account = formdata.get("account") as string,
      password = formdata.get("password") as string,
      repassword = formdata.get("repassword") as string;
    const commitInfo: UserInfo = {
      uuid,
      account,
      password,
      status: "",
    };
    console.log(commitInfo);

    if (password !== repassword) {
      ctx.state.msg = "两次密码不一致";
      ctx.state.qu = commitInfo;
      return ctx.render();
    }
    return UpdateUserInfo({
      uuid,
      account,
      password,
      status: "",
    }).then((r) => {
      if (r.ok) {
        const resp = new Response("", {
          headers: {
            Location: "/admin/login",
          },
          status: 302,
        });
        // deleteCookie(req.headers, "t");

        setCookie(resp.headers, {
          name: "t",
          path: "/admin",
          value: "",
          expires: new Date(),
          httpOnly: true,
        });
        return resp;
      } else {
        ctx.state.msg = "保存数据异常";
        return ctx.render();
      }
    });
  },
};
export default defineRoute<STATE>((req, ctx) => {
  return (
    <form method="post">
      <input type="hidden" name="uuid" value={ctx.state.qu?.uuid} />
      <label>
        <span>账号</span>
        <input
          type="text"
          name="account"
          value={ctx.state.qu?.account}
        />
      </label>
      <br />
      <label>
        <span>输入新密码</span>
        <input type="password" name="password" value={ctx.state.qu?.password} />
      </label>
      <br />
      <label>
        <span>确认密码</span>
        <input
          type="password"
          name="repassword"
          value={ctx.state.qu?.password}
        />
      </label>
      <br />
      <div class="text-red-400">{ctx.state.msg}</div>
      <input type="submit" value="提交" />
    </form>
  );
});
