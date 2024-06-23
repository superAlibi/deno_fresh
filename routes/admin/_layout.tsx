import { Handlers, defineLayout } from "$fresh/server.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { useInit } from "../../tools/hooks.ts";
import Aside from "../../components/aside.tsx";

export default defineLayout((_, { Component }) => {
  if (IS_BROWSER) {

    useInit();
  }
  return (
    <div class="flex">
      <Aside></Aside>
      <main class="overflow-x-hidden grow p-4 h-full overflow-y-auto">
        <Component />
      </main>
    </div>
  );
});
