import { Handler } from "$fresh/server.ts";

export const handler: Handler = (req) => {
 
  console.log(req.url);
  
  return new Response(req.method);
};
