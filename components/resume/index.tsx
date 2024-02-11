export const NotCredentialPage = () => {
  return (
    <main class="text-center h-screen flex-col justify-center flex p-8">
      <h1 class="text-3xl mb-4">
        访问此页面需要专属链接.
      </h1>
      <span class="text-gray-500 text-xs">
        因页面包含一些隐私信息,本人不想不公开😅
      </span>
    </main>
  );
};

export const CredentialExpiration=()=>{
  return <main>链接已过期,或访问链接设备超过4台</main>
}