import { Handlers, PageProps } from "$fresh/server.ts";
const NAMES = ["Alice", "Bob", "Charlie", "Dave", "Eve", "Frank"];
interface Data {
  result: string[];
  query: string;
}
export const handler: Handlers<Data> = {
  GET(req, ctx) {
    const url = new URL(req.url);
    const query = new URLSearchParams(url.search).get("q") || "";
    const result = NAMES.filter((i) => i.includes(query));
    return ctx.render({ result, query });
  },
};
export default function ({ data }: PageProps<Data>) {
  const { result, query } = data;
  return (
    <main>
      <form>
        <input type="text" name="q" value={query}></input>
        <button type="submit">搜索</button>
        <ul>
          {result.map((n) => <li>{n}</li>)}
        </ul>
      </form>
    </main>
  );
}
