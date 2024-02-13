import { defineLayout } from "$fresh/server.ts";

export default defineLayout((_, { Component }) => {
  return (
    <div class="flex">
      <aside class="overflow-x-hidden basis-1/6">
        <ul>
          <li class="px-4 py-2">
            <a href="/admin">首页</a>
          </li>
        </ul>
      </aside>
      <main class="overflow-x-hidden grow ">
        <Component />
      </main>
    </div>
  );
});
