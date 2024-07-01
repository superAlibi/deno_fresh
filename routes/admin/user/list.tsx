import { defineRoute, Handlers } from "$fresh/server.ts";
import STDTable, { Column } from "../../../components/stdtable.tsx";

export const handler: Handlers = {
  async GET(req, ctx) {
    return ctx.render();
  },
};
export default defineRoute((req, ctx) => {
  const colConfig: Column<any>[] = [
    {
      title: "账号",
      key: "account",
      type: "selection",
    },
    {
      title: "账号",
      key: "account",
    },
    {
      title: "状态",
      key: "status",
    },
    {
      title: "操作",
      type: "action",
      render: (i) => {
        return (
          <form action="/admin/user/edit">
            <input type="hidden" name="ui" value={i.account} />
            <input type="submit" value="修改密码"></input>
          </form>
        );
      },
    },
  ];
  return (
    <div>
      <h3>用户管理部分</h3>
      <STDTable data={[]} columns={colConfig}></STDTable>
    </div>
  );
});
