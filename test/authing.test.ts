import { decodeHex } from "$std/encoding/hex.ts";
import "$std/dotenv/load.ts";
Deno.test("test authing cloud", async (t) => {
  await t.step("parse authing secret key ", async (t) => {
    await t.step(" with hex", (t) => {
      console.log(decodeHex(Deno.env.get("AUTHING_SECRET_KEY")!));
      
    });
  });
});
