const BaseName = "server-secret-key";
import { decodeBase64 } from "$std/encoding/base64.ts";
// await Deno.openKv("https://api.deno.com/databases/f3473589-0050-4fa6-80b4-234c407d4845/connect");
const kvServer = await Deno.openKv();

globalThis.addEventListener("beforeunload", () => {
  kvServer.close();
});
const secretKey = Deno.env.get("server-secret-key");
let parsedSecretKey: Uint8Array;
if (!secretKey) {
  parsedSecretKey = crypto.getRandomValues(new Uint8Array(32));
} else {
  parsedSecretKey = decodeBase64(secretKey);
}
export async function getServerSecretKey() {
  const res = await kvServer.get([BaseName, "aes"]);
  if (!res.value) {
    kvServer.set([BaseName, "aes"], parsedSecretKey);
  }
  return parsedSecretKey
}
