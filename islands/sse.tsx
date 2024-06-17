import { useRef } from "preact/hooks";
import { Button } from "../components/Button.tsx";

export function EventSouceLands() {
  const eventSource = useRef<EventSource>();
  function start() {
    const souce = new EventSource("/api/sse");
    souce.addEventListener('open',(v)=>{
      console.log(v);
      
      console.log('打开成功')
    })
    souce.addEventListener("message", (v) => {
      console.log(v);
    });
    souce.addEventListener('error',v=>{
      console.error(v);
      
    })
    eventSource.current = souce;
  }
  function stop() {
    
    console.log(eventSource.current);
    
    if (eventSource.current!.readyState!==EventSource.CLOSED) {
      console.log('关闭');
      eventSource.current?.close();
    }
  }
  return (
    <div>
      <Button onClick={stop}>结束</Button>
      <Button onClick={start}>开始</Button>
    </div>
  );
}
