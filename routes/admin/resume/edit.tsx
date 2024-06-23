import { Handlers, PageProps } from "$fresh/server.ts";
import { Button } from "../../../components/Button.tsx";
import { Input } from "../../../components/input.tsx";
import { SelectOption } from "../../../components/select.tsx";
import { Select } from "../../../components/select.tsx";
import {
  UpdateCredential,
  UpdateCredentialParam,
} from "../../../denokv/resume.ts";
import { ManipulateType } from "npm:dayjs@latest";
const units = [
  ["hours", "小时"],
  ["milliseconds", "毫秒"],
  ["seconds", "秒"],
  ["minutes", "分"],
  ["days", "天"],
  ["months", "月"],
  ["years", "年"],
  // ["dates", "天"],
];
export const handler: Handlers = {
  async POST(req, ctx) {
    const form = await req.formData();
    const duration = form.get("duration") as string;

    const params: UpdateCredentialParam = {
      corporateName: form.get("corporateName") as string,
      duration: Number.parseInt(duration),
      durationUnit: form.get("durationUnit") as ManipulateType,
      drives: [],
    };
    const { ok } = await UpdateCredential(params);
    if (!ok) {
      return ctx.render(params);
    }
    return new Response(null, {
      status: 302,
      headers: {
        location: "/admin/resume",
      },
    });
  },
};
export default ({ data, url }: PageProps<Partial<UpdateCredentialParam>>) => {
  const options: SelectOption[] = units.map(([value, label], index) => ({
    label,
    value,
  }));
  return (
    <form
      action={url.pathname}
      class=" p-6 gap-4 grid md:grid-cols-1 xl:grid-cols-3"
    >
      <Input
        defaultValue={data?.corporateName}
        name="corporateName"
        type="text"
        label="公司名称"
        required
        placeholder="公司名称"
      />
      <Input
        label="有效时长"
        min={1}
        errormsg="请输入正确的数字"
        type="number"
        name="duration"
        value={data?.duration || 1}
      />
      <Select required value={data?.durationUnit} label="时长单位" options={options} />
      <Button className=" peer-invalid:disabled w-72" formmethod="post">
        提交
      </Button>
    </form>
  );
};
