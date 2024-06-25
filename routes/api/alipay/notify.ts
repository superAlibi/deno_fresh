import { Handlers } from "$fresh/server.ts";

export const handler:Handlers={
  GET(req,ctx){
    console.log(req.url);
    return new Response("Hello World");
  }
}