import { decodeHex } from "$std/encoding/hex.ts";
import { assertEquals } from "$std/assert/mod.ts";
import "$std/dotenv/load.ts";
import { getResumeAuthingSDK } from "../tools/sdk/authing.ts";
Deno.test("test authing cloud", async (t) => {
  const sdk = getResumeAuthingSDK();
  await t.step("parse authing secret key ", async (t) => {
    await t.step("with hex", () => {
      assertEquals(
        decodeHex(Deno.env.get("AUTHING_SECRET_KEY")!).length,
        16,
      );
    });
  });
  await t.step("login", async (t) => {
    await t.step("login with username passwd", async () => {
      const result = await sdk.signInByUsernamePassword({
        username: Deno.env.get("AUTHING_USERNAME")!,
        password: Deno.env.get("AUTHING_PASSWORD")!,
      });
      assertEquals(
        result.statusCode,
        200,
      );
    });
  });
});
