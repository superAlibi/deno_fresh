import { PageProps } from "$fresh/server.ts";

export default ({ Component }: PageProps) => {
  return (
    <div>
      <p>这是about目录布局性代码</p>
      <Component />
    </div>
  );
};
