const kvServer = await Deno.openKv();
import { ManipulateType } from "npm:dayjs@latest";
const BaseName = "user";
const tokenKey = "token";
Deno.addSignalListener("SIGABRT", () => {
  kvServer.close();
  console.log("链接已停止");
});

export interface TokenInfo {
  ageUnit: ManipulateType;
  maxAge: number;
  createAt: string;
  // 续期时间
  renewal: string;
  token: string;
  accountInfo: UserInfo;
}
export interface UserInfo {
  uuid: string;
  account: string;
  password: string;
  status: string;
  alipayOpenId?:string
  bindsapps?:[]
}
/**
 * 通过账号给出用户信息
 * @param account
 * @returns
 */
export async function GetUserInfo(account: string) {
  const result = await kvServer.get<UserInfo>([BaseName, account]);
  return result.value;
}

export async function GetUserList() {
  const result = kvServer.list<UserInfo>({ prefix: [BaseName] });
  const list: UserInfo[] = [];
  for await (const item of result) {
    list.push(item.value);
  }
  return list;
}
/**
 * 更新用户信息
 * @param params
 * @returns
 */
export function UpdateUserInfo(params: UserInfo) {
  return kvServer.set([BaseName, params.account], params);
}
/**
 * 删除用户信息
 * @param account
 * @returns
 */
export async function DeleteUserInfo(account: string[]) {
  for (const iterator of account) {
    await kvServer.delete([BaseName, iterator]);
  }
}

/**
 * 通过token给出用户信息
 * @param token
 * @returns
 */
export async function GetTokenInfo(token: string) {
  const result = await kvServer.get<TokenInfo>([tokenKey, token]);
  return result.value;
}
/**
 * 给出在线用户列表
 * @param token
 * @returns
 */
export async function GetTokens() {
  const result = kvServer.list<TokenInfo>({ prefix: [tokenKey] });
  const list: TokenInfo[] = [];
  for await (const iterator of result) {
    list.push(iterator.value);
  }
  return list;
}

/**
 * 删除token信息
 * @param tokenId
 * @returns
 */
export async function DeleteToken(tokenId: string[]) {
  for (const iterator of tokenId) {
    await kvServer.delete([tokenKey, iterator]);
  }
}
/**
 * 写入token信息
 * @param params
 * @returns
 */
export function SetTokenInfo(params: TokenInfo) {
  return kvServer.set([tokenKey, params.token], params);
}
