import { load } from "$std/dotenv/mod.ts";
import { UserInfo } from "../denokv/user.ts";
const values = await load();

for (const key in values) {
  Deno.env.set(key, values[key]);
}

const kvServer = await Deno.openKv(
  `https://api.deno.com/databases/${Deno.env.get("DBID")}/connect`,
);
const user: UserInfo = {
  uuid: crypto.randomUUID(),
  account: "admin",
  password: "admin",
  status: "",
};
const { ok } = await kvServer.set(["user", user.account], user);
if (ok) {
  console.log("写入成功");
}
kvServer.close()