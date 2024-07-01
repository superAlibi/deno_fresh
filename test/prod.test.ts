import { load } from "$std/dotenv/mod.ts";

const values = await load();

for (const key in values) {
  Deno.env.set(key, values[key]);
}

const kvServer = await Deno.openKv(
  `https://api.deno.com/databases/${Deno.env.get("DBID")}/connect`,
);

/* const { ok } = await kvServer.set(["user", ], );
if (ok) {
  console.log("写入成功");
} */
kvServer.close()