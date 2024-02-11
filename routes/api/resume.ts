import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async GET() {
    const now = Temporal.Now.instant();
    const kv = await Deno.openKv();
    const { ok } = await kv.set(["resume", now.epochMilliseconds], []);
    kv.close();
    if (ok) {
      return new Response(JSON.stringify(now.epochMilliseconds));
    }
    return new Response("时间戳写入失败", { status: 500 });
  },
};
