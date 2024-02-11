const kvServe = await Deno.openKv();
const list = kvServe.list({ prefix: ["resume"] });
for await (const iterator of list) {
  kvServe.delete(iterator.key);
}
