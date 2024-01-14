import { type PageProps } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";
export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>fresh's hello world</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body f-client-nav class="bg-[#86efac]">
        <h1 class="text-4xl font-bold">这是一个deno_fresh的hell world</h1>
        <nav>
          <ul class="flex justify-center gap-5 flex-wrap">
            <li>
              <a href="/">首页</a>
            </li>
            <li>
              <a href="/g1">路由组1</a>
            </li>
            <li>
              <a href="/g2">路由组2</a>
            </li>
            <li>
              <a title="有1/10的概率跳转/login" href="/about">关于我</a>
            </li>
            <li>
              <a href="/greet/陌生人" f-partial="/partials/陌生人">
                问好
              </a>
            </li>
            <li>
              <a href="/async-page">异步组件</a>
            </li>
            <li>
              <a href="/definehelper">defineRoute函数</a>
            </li>
            <li>
              <a href="/skipappwrapp">一个跳过appwarpper的路由</a>
            </li>
          </ul>
        </nav>
        <Component></Component>
      </body>
    </html>
  );
}
