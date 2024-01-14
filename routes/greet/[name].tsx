import { PageProps, RouteContext } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";
export interface GreetData {
  name: string;
}
export default function Greet(props: PageProps<GreetData>, ctx: RouteContext) {
  return (
    <main>
      {decodeURIComponent(props.params.name)}
    </main>
  );
}
