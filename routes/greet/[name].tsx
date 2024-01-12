import { PageProps } from "$fresh/server.ts";

export default function Greet(props: PageProps) {
  return <div>你好, {decodeURIComponent(props.params.name)}</div>;
}
