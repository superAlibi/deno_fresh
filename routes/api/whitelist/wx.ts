import { Handlers } from "$fresh/server.ts";
import { ParsedReqInfo } from "../_middleware.ts";
import { encode, Hash } from "https://deno.land/x/checksum@1.2.0/mod.ts";
type Query = {
  signature: string;
  timestamp: string;
  nonce: string;
  echostr: string;
};

export const handler: Handlers<ParsedReqInfo> = {
  GET(req, ctx) {
    const token='Gw8ShC0Sizvy5ivTdQSALw'
    const { signature, timestamp, nonce, echostr } = Object.fromEntries(
      ctx.data.query.entries(),
    ) as Query;
    const list = [token,timestamp, nonce].sort().join("");

    if (new Hash("sha1").digest(encode(list)).hex() === signature) {
      return new Response(echostr);
    }
    return new Response("校验错误", {
      status: 403,
    });
  },
};
