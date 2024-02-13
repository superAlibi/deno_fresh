import { load } from "$std/dotenv/mod.ts";
import { UpdateUserInfo, UserInfo } from "../../../denokv/user/index.ts";

const values = await load();
for (const key in values) {
  Deno.env.set(key, values[key]);
}
const user: UserInfo = {
  uuid: crypto.randomUUID(),
  account: "admin",
  password: "admin",
  status: "",
};
UpdateUserInfo(user).then(({ ok }) => {
  if (ok) {
    console.log("已经添加admin账号");
  } else {
    console.log("添加失败");
  }
});
