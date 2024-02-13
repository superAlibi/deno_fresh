// import { JSXInternal } from "preact";

import { useSignal } from "@preact/signals";
import { CmmitInfo } from "../routes/api/user/login.ts";

export default (p: any) => {
  const form = useSignal<CmmitInfo>({
      acc: "",
      pwd: "",
    }),
    errorInfo = useSignal("");
  const submitHandle = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    fetch("/api/user/login", {
      method: "post",
      body: JSON.stringify(form.value),
    }).then(async (resp) => {
      const msg = await resp.json();
      console.log("tmd");
      console.log(resp);

      if (resp.ok) {
        location.href = "/admin";
      } else {
        errorInfo.value = msg;
      }
    }).catch((e) => {
      console.error(e);
    });
  };
  return (
    <form
      class="p-4 bg-neutral-500 text-pink-400 text-center w-2/4 rounded-md"
      {...p}
      onSubmit={submitHandle}
      onChange={() => {
        errorInfo.value = "";
      }}
    >
      <fieldset class="text-center ">
        <legend class="text-2xl py-8">please login</legend>
        <div class=" w-1/2 m-auto mb-4">
          <label class=" flex justify-between">
            <span>acc:</span>
            <input
              name="acc"
              onInput={(e) => {
                form.value = { ...form.value, acc: e.target!.value };
              }}
              value={form.value.acc}
            />
          </label>
        </div>
        <div class=" w-1/2 m-auto ">
          <label class=" flex justify-between">
            <span>pwd:</span>
            <input
              autocomplete="true"
              type="password"
              name="pwd"
              onInput={(e) => {
                form.value = { ...form.value, pwd: e.target!.value };
              }}
              value={form.value.pwd}
            />
          </label>
        </div>
      </fieldset>
      {errorInfo.value
        ? <div class="text-red-500">{errorInfo.value}</div>
        : null}
      <button
        type="submit"
        class="mt-8 mb-2 rounded-full py-1  px-8 bg-sky-500 hover:bg-sky-700"
      >
        submit
      </button>
    </form>
  );
};
