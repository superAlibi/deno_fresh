import { defineRoute, Handlers } from "$fresh/server.ts";

import { deleteCookie, setCookie } from "$std/http/cookie.ts";
export const handler: Handlers = {
  async GET(req, ctx) {

  
    return ctx.render();
  },
  async POST(req, ctx) {
   return ctx.render();
  },
};
export default defineRoute((req, ctx) => {
  return (
    <form method="post">
     
    </form>
  );
});
