import { B64Img } from "./img.ts";
export default () => {
  return (
    <div>
      <div class="bg-slate-500 text-white bg-opacity-40 rounded-md px-2 w-auto">
        内容区域
      </div>
      <img class=" h-full object-contain" src={B64Img} />
    </div>
  );
};
