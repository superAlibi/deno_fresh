import { Handlers, PageProps } from "$fresh/server.ts";
import { useComputed } from "@preact/signals";
import { GetTokens, TokenInfo } from "../../denokv/user.ts";
import { CredentialMeta, GetCreditList } from "../../denokv/resume.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const credits = await GetCreditList();
    const liveUsers = await GetTokens();

    return ctx.render({ credits, liveUsers });
  },
};
export default function (
  { data }: PageProps<{ credits: CredentialMeta[]; liveUsers: TokenInfo[] }>,
) {
  const count = useComputed(() => data.credits.length);
  const countLive = useComputed(() => data.liveUsers.length);
  return (
    <div>
      <div>简历分享总计: {count.value}次</div>
      <div>在线用户数量: {countLive.value}人</div>
    </div>
  );
}
