import { Handlers, PageProps } from "$fresh/server.ts";
import { DeleteCredit } from "../../../denokv/resume.ts";
import { CredentialMeta, GetCreditList } from "../../../denokv/resume.ts";
import Resumetable from "../../../islands/resume/resumetable.tsx";
export const handler: Handlers = {
  async GET(_, ctx) {
    const list = await GetCreditList();
    return ctx.render(list);
  },
  async POST(req, ctx) {
    const form = await req.formData();
    const ids = form.getAll("ids").map((i) => Number.parseInt(i as string));
    await DeleteCredit(ids);
    return new Response(null, {
      status: 302,
      headers: {
        location: req.url,
      },
    });
  },
};
export default ({ url, data }: PageProps<CredentialMeta[]>) => {
  return <Resumetable action={url.pathname} data={data}></Resumetable>;
};
