import { defineRoute, RouteConfig } from "$fresh/server.ts";

export const config: RouteConfig = {
  skipAppWrapper: true,
  skipInheritedLayouts: true,
};
export default defineRoute(() => {
  return <div>这个路由比较特殊,他跳过了上层layout和_app</div>;
});
