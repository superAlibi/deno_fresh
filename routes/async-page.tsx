function awaiteTime(awaiteTime = 500) {
  return new Promise((re) => {
    setTimeout(re, awaiteTime);
  });
}
export default async function () {
  const time = Math.floor(Math.random() * 1000);
  await awaiteTime(time);
  return <div>这是一个异步组件的内容,异步处理用时:{time}</div>;
}
