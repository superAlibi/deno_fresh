import { Handler } from "$fresh/server.ts";

export const handler: Handler = (req) => {
  return new Response(req.method);
};
