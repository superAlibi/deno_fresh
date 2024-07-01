import { JSXInternal } from "https://esm.sh/v128/preact@10.19.6/src/jsx.d.ts";

export default (p: JSXInternal.HTMLAttributes<HTMLFormElement>) => {
  return (
    <form
      class="p-4 bg-neutral-500 text-pink-400 text-center w-96 rounded-md"
      {...p}
    >
    </form>
  );
};
