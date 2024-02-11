const BaseName = "resume";
export interface DriverMeta {
  creteAt: string;
  effectiveTime: number;
  driveId: string;
}
export async function GetDrivesByCredit(credit: number): Promise<string[]>;
export async function GetDrivesByCredit(): Promise<number>;
/**
 * 如果给存储凭据,那就是访问所有的设备
 * 如果没有给储存凭据,那就是生成凭据,并返回凭据id
 * @param credit
 * @returns
 */
export async function GetDrivesByCredit(credit?: number) {
  const kvServer = await Deno.openKv();

  if (credit) {
    const result = await kvServer.get<string[]>([BaseName, credit]);
    kvServer.close();
    return result.value || [];
  } else {
    const credit = Temporal.Now.instant().epochMilliseconds;
    const result = await kvServer.set([BaseName, credit], []);
    kvServer.close();
    if (result.ok) {
      return credit;
    }
    return 0;
  }
}
/**
 * 根据分享id添加设备
 * @param credit
 * @param driveid
 * @returns
 */
export async function AddDriversByCredit(credit: number, driveid: string) {
  const kvServer = await Deno.openKv();
  const { value } = await kvServer.get<string[]>([BaseName, credit]);
  const set = new Set(value);
  // 已经有了就不需要在储存
  if (set.has(driveid)) {
    kvServer.close();
    return true;
  }
  // 超过了分享上限
  if (value?.length && value.length >= 4) {
    kvServer.close();
    return false;
  } else {
    value?.push(driveid);
    const { ok } = await kvServer.set([BaseName, credit], value || [driveid]);
    kvServer.close();
    return ok ? true : false;
  }
}
