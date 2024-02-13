import { UpdateUserInfo, UserInfo } from "../../denokv/user/index.ts";
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
