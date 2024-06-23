import { JSX } from "preact/jsx-runtime";
import { TokenInfo } from "../../denokv/user.ts";
import { useComputed, useSignal } from "@preact/signals";
interface TokenTableProp {
  data?: TokenInfo[];
  action: string;
}
export default ({ data, ...other }: TokenTableProp) => {
  const choosed = useSignal(new Set<string>());
  const allChecked = useComputed(() => {
    if (!data?.length) return false;
    return data.length === choosed.value.size;
  });
  function chooseAllHandle(
    e: JSX.TargetedEvent<HTMLInputElement, InputEvent>,
  ) {
    const nv = new Set(choosed.value);
    if (e.currentTarget.checked) {
      data?.forEach((i) => {
        nv.add(i.token);
      });
    } else {
      nv.clear();
    }
    choosed.value = nv;
  }
  function chooseChange(token: string) {
    const nv = new Set(choosed.value);
    if (nv.has(token)) {
      nv.delete(token);
    } else {
      nv.add(token);
    }
    choosed.value = nv;
  }
  return (
    <form method="post" {...other}>
      <div>
        <button
          class="disabled:cursor-not-allowed disabled:bg-red-200 bg-red-400 rounded-md px-8 text-white"
          disabled={!choosed.value.size}
        >
          强制下线
        </button>
      </div>
      <table class=" table-fixed border-collapse border text-center">
        <thead>
          <tr>
            <th class="border border-slate-600">
              <input
                checked={allChecked}
                onChange={chooseAllHandle}
                type="checkbox"
              />
            </th>
            <th class="border border-slate-600">创建时间</th>
            <th class="border border-slate-600">最近续期时间</th>
            <th class="border border-slate-600">有效时长</th>
            <th class="border border-slate-600">token</th>
            <th class="border border-slate-600">时长单位</th>
            <th class="border border-slate-600">账号</th>
            <th class="border border-slate-600">操作</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((i) => {
            return (
              <tr>
                <td class="border border-slate-700">
                  <input
                    onChange={() => chooseChange(i.token)}
                    type="checkbox"
                    name="ids"
                    checked={choosed.value.has(i.token)}
                    value={i.token}
                  />
                </td>
                <td class="border border-slate-700">{i.createAt}</td>
                <td class="border border-slate-700">{i.renewal}</td>
                <td class="border border-slate-700">{i.maxAge}</td>
                <td class="border border-slate-700">
                  <a class="hover:cursor-pointer text-blue-500">复制</a>
                </td>
                <td class="border border-slate-700">{i.ageUnit}</td>
                <td class="border border-slate-700">{i.accountInfo.account}</td>
                <td class="border border-slate-700">
                  <a class="hover:cursor-pointer text-blue-500">强制下线</a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </form>
  );
};
