import { decodeHex } from "$std/encoding/hex.ts";
import "$std/dotenv/load.ts";
import { getResumeAuthingSDK } from "../tools/sdk/authing.ts";
Deno.test("test authing cloud", async (t) => {
  const sdk = getResumeAuthingSDK();
  await t.step("parse authing secret key ", async (t) => {
    await t.step("with hex", () => {
      console.log(decodeHex(Deno.env.get("AUTHING_SECRET_KEY")!));
    });
  });
  await t.step("login", async (t) => {
    await t.step("login with username passwd", async () => {
      const result = await sdk.signInByUsernamePassword({
        username: Deno.env.get("AUTHING_USERNAME")!,
        password: Deno.env.get("AUTHING_PASSWORD")!,
      });
      console.log(result);
    });
    await t.step("login with code", async () => {
      const result = await sdk.getAccessTokenByCode('rN4ixAoSNFRQNx-5H7Te8ABa9qYl8wXtGdVBXwYGLI3');
      console.log(result);
    });
  });
});
