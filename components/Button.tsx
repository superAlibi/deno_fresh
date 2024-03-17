import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { useMemo } from "preact/hooks";
export interface ButtonProp extends JSX.HTMLAttributes<HTMLButtonElement> {
  children: any;
}
export function Button({ children, className, ...ops }: ButtonProp) {
  const computedClass = useMemo(() => {
    return `px-2 py-1 border-gray-500 border-2 rounded transition-colors
bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300 ${className}`;
  }, []);
  return (
    <button
      class={computedClass}
      {...ops}
    >
      {children}
    </button>
  );
}
