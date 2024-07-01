import { Handler } from "$fresh/server.ts";

export const handler: Handler = (req) => {
  console.log("已受到请求", req.url);
  return new Response("已受到请求", { status: 500 });
};
