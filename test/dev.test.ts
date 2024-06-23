import { UpdateUserInfo, UserInfo } from "../denokv/user/index.ts";
const user: UserInfo = {
  uuid: crypto.randomUUID(),
  account: "admin",
  password: "admin",
  status: "",
};
Deno.test("注入admin账号", async () => {
  const { ok } = await UpdateUserInfo(user);
  if (ok) {
    console.log("已经添加admin账号");
  } else {
    console.log("添加失败");
  }
});
