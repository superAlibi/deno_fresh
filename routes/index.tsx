import { useSignal } from "@preact/signals";
import Counter from "../islands/Counter.tsx";

export default function Home() {
  return (
    <div>
      <ul>
        <li><a href="https://developer.mozilla.org/zh-CN/docs/Web/API/URLSearchParams/set">URLSearchParams</a>的set方法,其第二个参数值会默认使用<a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent">encodeURIComponent</a> 编码</li>
      </ul>
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
