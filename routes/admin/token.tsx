import { Handlers, PageProps } from "$fresh/server.ts";
import { DeleteToken, GetTokens, TokenInfo } from "../../denokv/user.ts";
import Tokentable from "../../islands/user/tokentable.tsx";
export const handler: Handlers<TokenInfo[]> = {
  async GET(req, ctx) {
    const list = await GetTokens();
    return ctx.render(list);
  },
  async POST(req, ctx) {
    const url = new URL(req.url);
    const ids = (await req.formData()).getAll("ids");
    await DeleteToken(ids.map((i) => (i as string)));
    return new Response(null, {
      status: 302,
      headers: {
        location: url.pathname,
      },
    });
  },
};
export default ({ data, url }: PageProps<TokenInfo[]>) => {
  return (
    <div>
      <Tokentable action={url.pathname} data={data} />
    </div>
  );
};
