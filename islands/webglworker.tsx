import { useEffect, useRef } from "preact/hooks";
import { EventInteractor } from "https://gitee.com/alibi-jia/threejs_on_worker/raw/master/src/helper/EventInteractor.ts";
export default function webglOnWorker() {
  const canvsref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (canvsref.current) {
      const interactor = new EventInteractor();
      const canvas = canvsref.current;
      const offscreen = canvas.transferControlToOffscreen();
      interactor.initRender(offscreen);
    }
  });
  return <canvas class="w-full h-full" ref={canvsref}></canvas>;
}
