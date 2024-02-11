import { defineRoute, Handler, Handlers, PageProps } from "$fresh/server.ts";
import { getCookies, setCookie } from "$std/http/mod.ts";
import {
  CredentialExpiration,
  NotCredentialPage,
} from "../../components/resume/index.tsx";
import { AddDriversByCredit, GetDrivesByCredit } from "../../denokv/index.ts";
interface Credentials {
  hasCredit: boolean;
  driverOverflow: boolean;
}
export const handler: Handlers<Credentials> = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const credential = url.searchParams.get("credential");
    if (!credential) {
      const head = new Headers();
      return ctx.render({
        hasCredit: false,
        driverOverflow: false,
      });
    }
    // 初始化环境变量
    const key = Number.parseInt(credential),
      drivers = await GetDrivesByCredit(key),
      driverOverflow = drivers.length >= 4,
      cookies = getCookies(req.headers),
      driveId = cookies["d"] || crypto.randomUUID();

    // 设置新的header,以设置请求头
    const headers = new Headers(req.headers);
    // 没有超出设备访问数量才开始
    if (!driverOverflow) {
      const success = await AddDriversByCredit(key, driveId);
      setCookie(headers, {
        name: "d",
        path: "/resume",
        value: driveId,
        maxAge: 60,
        httpOnly: true,
      });
      if (!success) {
        console.error(`储存设备id失败: 分享id: ${key}, 设备id:${driveId}`);
      }
    }

    return ctx.render(
      { hasCredit: true, driverOverflow },
      {
        headers,
      },
    );
  },
};
export default (({ data }: PageProps<Credentials>) => {
  if (!data.hasCredit) {
    return <NotCredentialPage />;
  }
  if (data.driverOverflow) {
    return <CredentialExpiration />;
  }
  return (
    <div>
      <div>徐家铭</div>
    </div>
  );
});
