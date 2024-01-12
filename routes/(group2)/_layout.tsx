import { PageProps } from "$fresh/server.ts";

export default (props: PageProps) => {
  return (
    <div>
      这个是分组2的布局内容
      <props.Component />
    </div>
  );
};
