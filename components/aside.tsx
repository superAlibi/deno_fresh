export default function () {
  return (
    <aside class=" h-screen overflow-x-hidden basis-60 bg-slate-600 text-white">
      <ul>
        <li class=" hover:bg-slate-500">
          <a class="h-full block px-4 py-2" href="/admin">首页</a>
        </li>
        <li class=" hover:bg-slate-500">
          <a class=" h-full block px-4 py-2" href="/admin/user">
            账户管理
          </a>
        </li>
        <li class=" hover:bg-slate-500">
          <a class="h-full block px-4 py-2" href="/admin/resume">
            简历分享
          </a>
        </li>
        <li class=" hover:bg-slate-500">
          <a class="h-full block px-4 py-2" href="/admin/token">
            在线用户
          </a>
        </li>
      </ul>
    </aside>
  );
}
