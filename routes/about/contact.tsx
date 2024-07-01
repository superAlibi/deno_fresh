import { Handlers, PageProps } from "$fresh/server.ts";
import { context } from "https://deno.land/x/esbuild@v0.19.11/mod.js";
import { Button } from "../../components/Button.tsx";
const NAMES = ["Alice", "Bob", "Charlie", "Dave", "Eve", "Frank"];
interface Data {
  result?: string[];
  query?: string;
  qt?: string;
}
export const handler: Handlers<Data> = {
  GET(req, ctx) {
    const url = new URL(req.url);
    const query = new URLSearchParams(url.search).get("q") || "";
    const result = NAMES.filter((i) =>
      (i.toLocaleLowerCase()).includes(query.toLocaleLowerCase())
    );
    return ctx.render({ result, query, qt: req.method });
  },
  POST(req, ctx) {
    console.log("接收到post提交");

    return ctx.render({ qt: req.method });
  },
  DELETE(req, ctx) {
    console.log("接收到删除提交");

    return ctx.render({ qt: req.method });
  },
};
export default function ({ data }: PageProps<Data>) {
  const { result, query } = data;
  return (
    <main class="flex justify-center">
      <form>
        <span>当前搜索方法:{data.qt}</span>
        <input
          type="text"
          placeholder="试着输入一点啥?"
          name="q"
          value={query}
        />

        <button
          class="hover:rounded-sm hover:bg-slate-400 px-2"
          type="submit"
        >
          搜索
        </button>
        <input
          class="hover:cursor-pointer hover:rounded-sm hover:bg-slate-400 px-2"
          formMethod="post"
          type="submit"
          value="post"
        >
        </input>
        <input
          class=" hover:cursor-pointer hover:rounded-sm hover:bg-slate-400 px-2"
          formMethod="delete"
          type="submit"
          value="delete"
        >
        </input>
        <ul>
          {result?.map((n) => <li>{n}</li>)}
        </ul>
      </form>
    </main>
  );
}
