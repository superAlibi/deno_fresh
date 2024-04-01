import { B64Img } from "../../assets/img.ts";
export default () => {
  return (
    <div>
      <div>
        <p>阴影盒子</p>
        <div class="bg-slate-500 text-white bg-opacity-40 rounded-md px-2 w-auto">
          内容区域
        </div>
      </div>
      <div class="bg-black">
        <p>图片</p>
        <img class=" h-full object-contain" src={B64Img} />
      </div>
      <div class="p-2">
        <p class="relative ">标记</p>
        <div class="group has-[:hover]: z-10 bg-green-800 rounded-full border-2 border-solid font-bold leading-8 cursor-pointer relative border-white text-white w-9 h-9 text-center ">
          <span class="peer">1</span>
          <div class="hidden text-sm  group-hover:block text-left cursor-pointer w-44 absolute top-0 left-10 z-10 p-3 bg-white rounded shadow text-black">
            <p class="annotation-desc">楼层:</p>
            <p class="annotation-desc">问题类型:</p>
            <p class="annotation-desc">创建人:</p>
            <p class="annotation-desc">责任人:</p>
            <p class="annotation-desc">描述:</p>
          </div>
        </div>
      </div>
    </div>
  );
};
