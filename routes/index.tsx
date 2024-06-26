import { useSignal } from "@preact/signals";
import Counter from "../islands/Counter.tsx";

export default function Home() {
  return (
    <div>
      <ul>
        <li><a href="https://developer.mozilla.org/zh-CN/docs/Web/API/URLSearchParams/set">URLSearchParams</a>的set方法,其第二个参数值会默认使用<a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent">encodeURIComponent</a> 编码</li>
        <li>可喜可贺,wsl支持镜像网络了,可以提供主机所在的lan访问主机内部的wsl网络</li>
      </ul>
      
    </div>
  );
}
