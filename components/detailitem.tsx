import { JSX } from "preact/jsx-runtime";

export interface DetailPanelProp {
  summary: JSX.Element;
  content: JSX.Element;
}
export function DetailPanel({ content, summary }: DetailPanelProp) {
  return (
    <details
      class="open:bg-white dark:open:bg-slate-900 open:ring-1 open:ring-black/5 dark:open:ring-white/10 open:shadow-lg p-6 rounded-lg"
      open
    >
      <summary class="text-sm leading-6 text-slate-900 dark:text-white font-semibold select-none">
        {summary}
      </summary>
      <div class="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
        {content}
      </div>
    </details>
  );
}
