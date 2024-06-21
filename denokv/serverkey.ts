const BaseName = "server-secret-key";
// import { decodeBase64 } from "$std/encoding/base64.ts";
// await Deno.openKv("https://api.deno.com/databases/f3473589-0050-4fa6-80b4-234c407d4845/connect");
const kvServer = await Deno.openKv();

globalThis.addEventListener("beforeunload", () => {
  kvServer.close();
});
// const envSecretKey = "server-secret-key";
export async function getServerSecretKey() {
  /* const secretKey = Deno.env.get(envSecretKey);
  if (secretKey) {
    const parsedSecretKey: Uint8Array = decodeBase64(secretKey);
    kvServer.set([BaseName, "aes"], parsedSecretKey);
    return parsedSecretKey;
  } */
  const denokvSecretKey = await kvServer.get<Uint8Array>([BaseName, "aes"]);

  if (!denokvSecretKey.value) {
    const aeskey = crypto.getRandomValues(new Uint8Array(16));
    kvServer.set([BaseName, "aes"], aeskey);
    return aeskey;
  }
  return denokvSecretKey.value;
}
