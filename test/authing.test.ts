import { decodeHex } from "$std/encoding/hex.ts";
import "$std/dotenv/load.ts";
import { resumeAuhtingSDK } from "../tools/sdk/authing.ts";
Deno.test("test authing cloud", async (t) => {
  await t.step("parse authing secret key ", async (t) => {
    await t.step(" with hex", (t) => {
      console.log(decodeHex(Deno.env.get("AUTHING_SECRET_KEY")!));
    });
  });
  await t.step("login", async (t) => {
    await t.step("login with username", async (t) => {
      const result = await resumeAuhtingSDK.loginByUsername(
        Deno.env.get("AUTHING_username")!,
        Deno.env.get("AUTHING_password")!,
      );
      console.log(result);
     await resumeAuhtingSDK.logout();
    });
  });
});
