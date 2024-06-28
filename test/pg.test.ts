import { Client } from "postgre";
import { pgpool } from "../db/postgre.ts";
const pgClient = new Client();
await pgClient.connect();
Deno.test("postgresql test", async (t) => {
  await t.step("client test", async (t) => {
  
    await t.step("query array test", async (t) => {
      const rust = await pgClient.queryArray(
        "select account , uuid,age from public.admins",
      );
      console.log(rust);
    });
    await t.step("query object test", async (t) => {
      const rust = await pgClient.queryObject(
        "select account , uuid,age from public.admins",
      );
      console.log(rust);
    });
    await t.step("query by template string test", async (t) => {
      const rust = await pgClient.queryObject(
        "select account , uuid,age from public.admins",
      );
      console.log(rust);
    });
 
  });
  await t.step("pool test", async (t) => {
    const client = await pgpool.connect();
    const result = await client
      .queryObject`select account , uuid,age from public.admins`;
    console.log(result);
    client.createTransaction
    client.release();
  });

});
