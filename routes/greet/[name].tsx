import { PageProps, RouteContext } from "$fresh/server.ts";

export default function Greet(props: PageProps,_ctx:RouteContext) {
  
  return <div>你好, {decodeURIComponent(props.params.name)}</div>;
}
