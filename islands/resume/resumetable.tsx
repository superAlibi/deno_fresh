import { useRef } from "preact/hooks";
import { CredentialMeta } from "../../denokv/resume.ts";
import { useComputed, useSignal } from "@preact/signals";
// import Edit from "./edit.tsx";
import { JSX } from "preact";

interface ResumeTableProps {
  action: string;
  data: CredentialMeta[];
}
export default ({ data, action }: ResumeTableProps) => {
  const choosedSet = useSignal(new Set<number>());
  const isCheckedAll = useComputed(() => {
    if (!data.length) return false;
    return data.length === choosedSet.value.size;
  });
  function handleChange(id: number) {
    const nv = new Set(choosedSet.value);
    if (!nv.has(id)) {
      nv.add(id);
    } else {
      nv.delete(id);
    }
    choosedSet.value = nv;
  }
  function handleCheckall(e: JSX.TargetedEvent<HTMLInputElement, InputEvent>) {
    const nv = new Set(choosedSet.value);
    if (e.currentTarget.checked) {
      data.forEach((i) => {
        nv.add(i.id);
      });
    } else {
      nv.clear();
    }
    choosedSet.value = nv;
  }
  function handleCopy(params: number) {
    const newUrl = new URL(location.href);
    newUrl.pathname='/resume'
    newUrl.searchParams.set("credential", params.toString());
    const type = "text/plain";
    const blob = new Blob([newUrl.toString()], { type });
    const data = [new ClipboardItem({ [type]: blob })];
    navigator.clipboard.write(data).then((d) => {
      console.log("复制成功");
    });
  }
  // const isOpen = useSignal(false);
  return (
    <form  method="post" action={action}>
      {/* <Edit
        onClose={() => {
          isOpen.value = false;
        }}
        open={isOpen.value}
      /> */}
      <div>
        <button
          disabled={!choosedSet.value.size}
          class="disabled:cursor-not-allowed disabled:bg-red-200 bg-red-400 rounded-md px-8 text-white"
        >
          删除
        </button>
        {/* <button
          type="button"
          onClick={() => {
            console.log("not msg");
            isOpen.value = !isOpen.value;
          }}
        >
          确定无法{isOpen.value}
        </button> */}
        <a
          type="button"
          href="/admin/resume/edit"
          class=" bg-orange-500 rounded-md px-8 text-white hover:bg-orange-600 active:bg-orange-700"
        >
          新增
        </a>
      </div>
      <table class=" table-fixed border-collapse border text-center">
        <thead>
          <tr>
            <th class="border border-slate-600">
              <input
                checked={isCheckedAll}
                disabled={!data.length}
                type="checkbox"
                name="checkall"
                onChange={handleCheckall}
              />
            </th>
            <th class="border border-slate-600">
              创建时间
            </th>
            <th class="border border-slate-600">
              分享目标
            </th>
            <th class="border border-slate-600">
              有效期
            </th>
            <th class="border border-slate-600">
              有效期单位
            </th>
            <th class="border border-slate-600">
              已查看设备
            </th>
            <th class="border border-slate-600">
              分享
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            return (
              <tr key={index}>
                <td class="border border-slate-700">
                  <input
                    checked={choosedSet.value.has(item.id)}
                    type="checkbox"
                    name="ids"
                    onChange={() => handleChange(item.id)}
                    value={item.id}
                  />
                </td>
                <td class="border border-slate-700">{item.createAt}</td>
                <td class="border border-slate-700">{item.corporateName}</td>
                <td class="border border-slate-700">{item.duration}</td>
                <td class="border border-slate-700">{item.durationUnit}</td>
                <td class="border border-slate-700">{item.drives.length}</td>
                <td class="border border-slate-700">
                  <a
                    class="hover:cursor-pointer text-blue-600"
                    onClick={() => handleCopy(item.id)}
                  >
                    复制
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </form>
  );
};
