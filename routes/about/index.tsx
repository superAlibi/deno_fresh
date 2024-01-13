import { Handlers } from "$fresh/server.ts";
import { defineRoute } from "$fresh/src/server/defines.ts";
import { Button } from "../../components/Button.tsx";
import { MiddlewareState } from "./_middleware.ts";

export default defineRoute<MiddlewareState>((req, ctx) => {

  if (ctx.state.logined) {
    return (
      <main>
        <h2>关于</h2>
        <a href="/about/contact">我的联系人</a>
      </main>
    );
  }else{
    return new Response(null,{
      status:303,
      headers:{
        Location:'/login'
      }
    })
  }
});
