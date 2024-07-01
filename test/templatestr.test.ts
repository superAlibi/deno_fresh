Deno.test("template string ", async (t) => {
  const tag = (strings: any, ...keys: any[]) => {
    console.log(strings, keys);
    return (...values: any[]) => {
      const dict = values[values.length - 1] || {};
      const result = [strings[0]];
      keys.forEach((key, i) => {
        const value = Number.isInteger(key) ? values[key] : dict[key];
        result.push(value, strings[i + 1]);
      });
      return result.join("");
    };
  };
  await t.step("tag template", async () => {
    const world = "世界";
    const t1Closure = tag`${0}${1}${0}!`;
    tag`你好 ${world}.`;
  });
});
