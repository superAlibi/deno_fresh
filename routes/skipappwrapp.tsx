import { RouteConfig, defineRoute } from "$fresh/server.ts";

export const config:RouteConfig={
  skipAppWrapper:true
}
export default defineRoute(()=>{
  return <div>这个路由比较特殊,他跳过了_app</div>
})