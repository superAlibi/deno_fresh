import { Handlers } from "$fresh/server.ts";
import { Button } from "../../components/Button.tsx";


export default function () {
  return (
    <main>
      <h1>关于</h1>
      <a href="about/contact">我的联系人</a>
      <p>这是一个关于的页面</p>
      <Button>这是个啥</Button>
    </main>
  );
}
