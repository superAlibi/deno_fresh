import { Handlers, PageProps } from "$fresh/server.ts";
import {
  UpdateCredential,
  UpdateCredentialParam,
} from "../../../denokv/index.ts";
import { ManipulateType } from "npm:dayjs@latest";
const units = [
  "hours",
  "milliseconds",
  "seconds",
  "minutes",
  "days",
  "months",
  "years",
  "dates",
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
export default ({ data, url }: PageProps<UpdateCredentialParam>) => {
  return (
    <form action={url.pathname}>
      <label class="focus-within:bg-red-400">
        <span class="after:content-['*'] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
          公司名称
        </span>
        <input
          class="required:before:text-red before:content-['*']"
          required
          type="text"
          value={data?.corporateName}
          name="corporateName"
        />
      </label>

      <label>
        <span class="after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
          有效时长
        </span>
        <input
          min={1}
          type="number"
          name="duration"
          value={data?.duration || 1}
        />
      </label>

      <label>
        <span class=" after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">
          时长单位
        </span>
        <select name="durationUnit">
          {units.map((i) => (
            <option checked={data?.durationUnit === i} value={i}>{i}</option>
          ))}
        </select>
      </label>
      <button type="submit" formmethod="post">新增</button>
      <a href="/admin/resume">取消</a>
    </form>
  );
};
