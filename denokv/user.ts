const kvServer = await Deno.openKv();

const BaseName = "user";

Deno.addSignalListener("SIGABRT", () => {
  kvServer.close();
  console.log("链接已停止");
});
export function setRefreshToken(refreshToken: string) {
  return kvServer.set(["refreshToken"], refreshToken);
}
/**
 * @returns
 */
export async function getFreshToekn() {
  return await kvServer.get(["refreshToken"]).then((v) => v.value as string);
}
export function storeUserInfo(idTOken: string, userInfo: unknown) {
  return kvServer.set([BaseName, idTOken], userInfo);
}
export async function getUserInfo<T>(idTOken: string) {
  return await kvServer.get([BaseName, idTOken]).then((r) => {
    return r.value as T;
  });
}
