import { defineLayout, PageProps } from "$fresh/server.ts";

export default defineLayout((_, {Component}: PageProps) => {
  return (
    <div>
      这个是分组1的布局内容
      <Component />
    </div>
  );
});
