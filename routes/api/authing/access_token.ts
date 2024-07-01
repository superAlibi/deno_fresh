import { Handlers } from "$fresh/server.ts";
import { ParsedCTX } from "../../../types.d.ts";
// import { resumeAuhtingSDK } from "../../tools/sdk/authing.ts";

export const handler: Handlers<ParsedCTX> = {
  GET(req, ctx) {
    // resumeAuhtingSDK.getA
    const code = ctx.data.query.get("code");
    if (!code) {
      return new Response(JSON.stringify({
        code: 400,
        message: "code is required",
      }));
    }
   
    return new Response(JSON.stringify(ctx.data.query.toString()));
  },
  POST(req, ctx) {
    ctx.data.query.forEach((value, key) => {
      console.log(key, value);
    });
    return new Response(JSON.stringify({
      code: 200,
      message: "ok",
    }));
  },
};
