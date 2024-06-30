import { Handlers } from "$fresh/server.ts";
import { ParsedReqInfo } from "./_middleware.ts";

export const handler: Handlers<ParsedReqInfo> = {
  GET(req, ctx) {
    return new Response(JSON.stringify(ctx.data.query));
  },
};
