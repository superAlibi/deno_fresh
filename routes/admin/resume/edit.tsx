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
    <form method="post" action={url.pathname}>
      <div>
        <label>
          <span>公司名称</span>
          <input
            required
            type="text"
            value={data?.corporateName}
            name="corporateName"
          />
        </label>
      </div>
      <div>
        <label>
          <span>有效时长</span>
          <input
            min={1}
            type="number"
            name="duration"
            value={data?.duration || 1}
          />
        </label>
      </div>
      <div>
        <label>
          <span>时长单位</span>
          <select name="durationUnit">
            {units.map((i) => (
              <option checked={data?.durationUnit === i} value={i}>{i}</option>
            ))}
          </select>
        </label>
      </div>
      <button>新增</button>
      <a href="/admin/resume">取消</a>
    </form>
  );
};
