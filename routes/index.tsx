import { useSignal } from "@preact/signals";
import Counter from "../islands/Counter.tsx";

export default function Home() {
  return (
    <div>
      <a
        href="https://ipw.cn/ipv6webcheck/?site=[240e:398:e06:a68:eba:7afb:c82d:8fe5]:32769/"
        title="本站支持IPv6访问"
        target="_blank"
      >
        <img
          style="display:inline-block;vertical-align:middle"
          alt="本站已支持IPv6访问"
          src="/ipv6-s2.svg"
        />
      </a>
    </div>
  );
}
