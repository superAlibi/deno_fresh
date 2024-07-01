import { Handlers, PageProps } from "$fresh/server.ts";
import { useComputed } from "@preact/signals";
import { CredentialMeta, GetCreditList } from "../../denokv/resume.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const credits = await GetCreditList();

    return ctx.render({ credits });
  },
};
export default function (
  { data }: PageProps<{ credits: CredentialMeta[];  }>,
) {
  const count = useComputed(() => data.credits.length);
  return (
    <div>
      <div>简历分享总计: {count.value}次</div>
    </div>
  );
}
