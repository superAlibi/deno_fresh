const kvServe = await Deno.openKv();
const list = kvServe.list({ prefix: ["resume"] });
for await (const iterator of list) {
  console.log(iterator.key,iterator.value);
  
  kvServe.delete(iterator.key);
}
