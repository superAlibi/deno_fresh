const BaseName = "resume";
// await Deno.openKv("https://api.deno.com/databases/f3473589-0050-4fa6-80b4-234c407d4845/connect");
const kvServer = await Deno.openKv();
import { ManipulateType } from "npm:dayjs@latest";
globalThis.addEventListener("beforeunload", () => {
  kvServer.close();
});

export interface CredentialMeta {
  id: number;
  // 创建时间
  createAt: string;
  // 公司名称
  corporateName: string;
  // 分享有效期
  duration: number;
  durationUnit: ManipulateType;
  //已经访问过的设备列表
  drives: DriveMeta[];
}
/**
 * 设备元信息
 * 之所以单独定义接口是因为考虑拓展需求
 */
export interface DriveMeta {
  driveId: string;
}

/**
 * 如果给存储凭据,那就是访问所有的设备
 * 如果没有给储存凭据,那就是生成凭据,并返回凭据id
 * @param credit
 * @returns
 */
export async function GetCredit(
  credit: number,
) {
  const result = await kvServer.get<CredentialMeta>([BaseName, credit]);
  return result.value;
}
/**
 * 给出所有的凭据
 * @returns
 */
export async function GetCreditList() {
  const result = kvServer.list<CredentialMeta>({ prefix: [BaseName] });
  const list: CredentialMeta[] = [];
  for await (const item of result) {
    item.value;
    list.push(item.value);
  }
  return list;
}
/**
 * 添加一个分享信息
 * @param params
 * @param credit
 * @returns
 */
export function UpdateCredential(
  params: CredentialMeta,
  credit?: number,
) {
  if (!credit) {
    credit = Temporal ? Temporal.Now.instant().epochMilliseconds : Date.now();
  }
  params.id = credit;
  return kvServer.set([BaseName, credit], params);
}
/**
 * 根据分享id添加设备
 * @param credit
 * @param driveid
 * @returns
 */
export async function AddDriversByCredit(
  credit: number,
  drives: DriveMeta,
) {
  const value = await GetCredit(credit);
  if (!value) {
    return null;
  }
  const set = new Set(value?.drives?.map((i) => i.driveId));
  // 已经有了就不需要在储存
  if (!set.has(drives.driveId)) {
    value.drives.push(drives);
  }
  return UpdateCredential(value, credit);
}
/**
 * 删除数据
 * @param param
 */
export async function DeleteCredit(param: number[]) {
  for (const iterator of param) {
    await kvServer.delete([BaseName, iterator]);
  }
}
