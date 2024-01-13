import { defineRoute } from "$fresh/src/server/defines.ts";
import { Handlers, RouteConfig, RouteContext } from "$fresh/server.ts";
export const config: RouteConfig = {
  // skipAppWrapper: true,
  skipInheritedLayouts: true,
};
export const handler: Handlers = {
  GET(req, ctx) {
    return ctx.render();
  },
  POST(req, ctx) {
    return ctx.render();
  },
};
export default defineRoute(() => {
  return (
    <main>
      <form
        action="/api/user/login"
        method="POST"
        class=" w-1/4  mr-auto ml-auto"
      >
        <fieldset class=" flex-1 flex justify-center flex-wrap">
          <legend class="mr-auto ml-auto">登录</legend>
          <label class="min-w-full flex">
            <div class="w-20">用户名</div>
            <input class="border-b-2 flex-1" name="username"></input>
          </label>
          <label class="min-w-full flex">
            <div class="w-20">密码</div>
            <input class="border-b-2 flex-1" type="password" name="password">
            </input>
          </label>
        </fieldset>
        <div class="flex gap-5 justify-center">
          <button type="submit">登录</button>
          <button type="submit">跳过登录</button>
        </div>
      </form>
    </main>
  );
});
