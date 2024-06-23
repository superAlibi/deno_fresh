import { defineRoute, Handlers,  } from "$fresh/server.ts";


import { UserInfo } from "../../../denokv/user.ts";
import { GetUserList } from "../../../denokv/user.ts";

export const handler: Handlers<any, Array<UserInfo> | null> = {
  async GET(req, ctx) {
    const list = await GetUserList();
    ctx.state = list;
    return ctx.render();
  },
 
};
export default defineRoute<Array<UserInfo> >(async (req, ctx) => {


  return (
    <div>
      <h3>用户管理部分</h3>

      <table>
        <thead>
          <tr>
            <th>账号</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {ctx.state.map((i) => {
            return (
              <tr>
                <td>{i.account}</td>
                <td>{i.status}</td>
                <td>
                  <form action="/admin/user/edit">
                    <input type="hidden" name="ui" value={i.account} />
                    <input type="submit" value="修改密码"></input>
                  </form>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
});
