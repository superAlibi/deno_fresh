import { FreshContext } from "$fresh/server.ts";
import { getCookies } from "$std/http/mod.ts";
export interface MiddlewareState {
  logined: boolean;
}
export interface MyCookies extends Record<string, string> {
  token: string;
}
export const handler = async (
  req: Request,
  ctx: FreshContext<MiddlewareState>,
) => {
  const cook = getCookies(req.headers) as MyCookies;
  ctx.state.logined = !!cook.token;
  const resp = await ctx.next();
  return resp;
};
