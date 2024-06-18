import { IS_BROWSER } from "$fresh/runtime.ts";
import { useEffect, useRef } from "preact/hooks";

export default function webglOnWorker() {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (IS_BROWSER) {
      navigator.mediaDevices.getUserMedia({
        video: {
          height: {
            ideal: 720,
          },
          width: {
            ideal: 1090,
          },
        },
      }).then((stream) => {
        videoRef.current!.srcObject = stream;
      }).catch((e)=>{
        globalThis.alert(e.message)
      })
    }
  }, [videoRef]);

  return <video autoPlay controls class="h-full" ref={videoRef}></video>;
}
