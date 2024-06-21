import { AESCBC } from "../tools/crypto/aes.ts";
import { RSAOAEP, RSAPSS } from "../tools/crypto/rsa.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
const encoder = new TextEncoder(), decoder = new TextDecoder();
Deno.test("AES", async (t) => {
  await t.step("AESCBC", async (t) => {
    const key = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(16));
    const aes = new AESCBC(key);

    await t.step("encrypt", async () => {
      const plaintext = encoder.encode("hello world");
      await aes.encrypt(plaintext, iv);
    });
    await t.step("decrypt", async () => {
      const ciphertext = await aes.encrypt(
        encoder.encode("hello world"),
        iv,
      );
      assertEquals(
        decoder.decode(await aes.decrypt(ciphertext, iv)),
        "hello world",
      );
    });
  });
});
Deno.test("RSA", async (t) => {
  await t.step("RSAOAEP", async (t) => {
    const rsa = new RSAOAEP();
    await t.step("encrypt", async () => {
      const plaintext = encoder.encode("hello world");
      await rsa.encrypt(plaintext);
    });
    await t.step("decrypt", async () => {
      const ciphertext = await rsa.encrypt(
        encoder.encode("hello world"),
      );
      assertEquals(
        decoder.decode(await rsa.decrypt(ciphertext)),
        "hello world",
      );
    });
  });
  await t.step("RSASSA", async (t) => {
    const rsa = new RSAPSS();
    await t.step("sign", async () => {
      const plaintext = encoder.encode("hello world");
      await rsa.sign(plaintext);
    });
    await t.step("verify", async () => {
      const signature = await rsa.sign(
        encoder.encode("hello world"),
      );
      assertEquals(
        await rsa.verify(signature, encoder.encode("hello world")),
        true,
      );
    });
  });
});
