import { defineRoute, Handler, Handlers, PageProps } from "$fresh/server.ts";
import { getCookies, setCookie } from "$std/http/mod.ts";
import dayjs from "npm:dayjs@latest";
import {
  CredentialExpiration,
  NotCredentialPage,
} from "../../components/resume/index.tsx";
import { AddDriversByCredit, GetCredit } from "../../denokv/index.ts";
interface Credentials {
  // 没有凭据
  hasCredit: boolean;
  // 访问设备过多
  driverOverflow: boolean;
  // 过期
  expires: boolean;
  expiresDateTime?: string;
  driveId?: string;
}
async function getReqState(req: Request): Promise<Credentials> {
  const url = new URL(req.url);
  const credential = url.searchParams.get("credential");
  if (!credential) {
    return ({
      hasCredit: false,
      driverOverflow: false,
      expires: false,
    });
  }
  const key = Number.parseInt(credential),
    credit = await GetCredit(key);

  if (!credit) {
    return ({
      hasCredit: true,
      driverOverflow: false,
      expires: true,
    });
  }
  const driverOverflow = !credit || (credit?.drives?.length || 0) >= 4,
    cookies = getCookies(req.headers),
    driveId = cookies["d"] || crypto.randomUUID();

  const success = await AddDriversByCredit(key, { driveId });

  const inst = dayjs(credit.createAt).add(
    credit.duration,
    credit.durationUnit,
  );

  const expires = inst.isBefore(new Date());

  if (!success?.ok) {
    console.error(`储存设备id失败: 分享id: ${key}, 设备id:${driveId}`);
  }

  return ({
    hasCredit: true,
    driverOverflow,
    expires,
    driveId,
    expiresDateTime: inst.toDate().toLocaleString(),
  });
}
export const handler: Handlers<Credentials> = {
  async GET(req, ctx) {
    const state = await getReqState(req);
    const headers = new Headers(req.headers);
    if (state.driveId && state.expiresDateTime) {
      setCookie(headers, {
        name: "d",
        path: "/resume",
        value: state.driveId,
        expires: new Date(state.expiresDateTime.toString()),
        httpOnly: true,
      });
    }
    return ctx.render(
      state,
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
    return <div>只能在4台设备访问</div>;
  }
  if (data.expires) {
    return <div>链接已过期</div>;
  }

  return (
    <div>
      <div>链接过期时间{data.expiresDateTime}</div>
    </div>
  );
});
