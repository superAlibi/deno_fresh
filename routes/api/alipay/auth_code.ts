import { Handlers } from "$fresh/server.ts";
import { ParsedReqInfo } from "../_middleware.ts";

export const handler:Handlers<ParsedReqInfo>={
  GET(req,ctx){
    const auth_code=ctx.data.query.get('auth_code')
    const app_id=ctx.data.query.get('app_id')
    const scope=ctx.data.query.get('scope')
    console.log(req.url);
    
    return new Response("Hello World");
  }
}