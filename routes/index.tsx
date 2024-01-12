import { useSignal } from "@preact/signals";
import Counter from "../islands/Counter.tsx";

export default function Home() {
  return (
    <div class="px-4 py-8 mx-auto bg-[#86efac]">
      <h1 class="text-4xl font-bold">这是一个deno_fresh的hell world</h1>
      <nav>
        <ul>
          <li>
            <a href="/g1">路由组1</a>
          </li>
          <li>
            <a href="/g2">路由组2</a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
