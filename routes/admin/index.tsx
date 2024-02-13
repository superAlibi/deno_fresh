import { Handlers, PageProps } from "$fresh/server.ts";
import { CredentialMeta, GetCreditList } from "../../denokv/index.ts";

export const handler: Handlers<CredentialMeta[]> = {
  async GET(req, ctx) {
    const list = await GetCreditList();
    return ctx.render(list);
  },
};
export default function ({ data }: PageProps<CredentialMeta[]>) {
  return (
    <div>
      <ul>
        {data.map((item) => <li>{item.createAt}</li>)}
      </ul>
    </div>
  );
}
