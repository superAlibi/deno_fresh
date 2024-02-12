import { load } from "https://deno.land/std@0.215.0/dotenv/mod.ts";
const env = await load();
for (const key in env) {
  Deno.env.set(key, env[key]);
}
// deno deploy denokv
const kvServer = await Deno.openKv(
  `https://api.deno.com/databases/${Deno.env.get("DBID")}/connect`,
);
for await (const result of kvServer.list({ prefix: ["resume"] })) {
  console.log(result.key, result.value);
}
kvServer.close();
