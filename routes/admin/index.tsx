import { Handlers, PageProps } from "$fresh/server.ts";
import { useComputed } from "@preact/signals";
import { CredentialMeta, GetCreditList } from "../../denokv/index.ts";

export const handler: Handlers<CredentialMeta[]> = {
  async GET(req, ctx) {
    const list = await GetCreditList();
    return ctx.render(list);
  },
};
export default function ({ data }: PageProps<CredentialMeta[]>) {
  const count = useComputed(() => data.length);
  return (
    <div>
      <div>简历分享总计: {count.value}次</div>
      <div>在线用户数量: {count.value}次</div>
    </div>
  );
}
