// import { JSXInternal } from "preact";

import { useSignal } from "@preact/signals";
import { CmmitInfo } from "../routes/api/user/login.ts";

export default (p: any) => {
  const form = useSignal<CmmitInfo>({
      acc: "",
      pwd: "",
    }),
    errorInfo = useSignal(""),
    loging = useSignal(false);
  const submitHandle = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    if (loging.value) {
      return;
    }
    loging.value = true;
    fetch("/api/user/login", {
      method: "post",
      body: JSON.stringify(form.value),
    }).then(async (resp) => {
      const msg = await resp.json();
      if (resp.ok) {
        location.href = "/admin";
      } else {
        errorInfo.value = msg;
      }
    }).finally(() => {
      loging.value = false;
    });
  };
  return (
    <form
      class="p-4 bg-neutral-500 text-pink-400 text-center w-96 rounded-md"
      {...p}
      onSubmit={submitHandle}
      onChange={() => {
        errorInfo.value = "";
      }}
    >
      <fieldset class="text-center ">
        <legend class="text-2xl py-8">访问认证</legend>
        <div class=" w-60 m-auto mb-4">
          <label class=" flex justify-between">
            <span>账户👨‍✈️</span>
            <input
              name="acc"
              onInput={(e) => {
                form.value = { ...form.value, acc: e.target!.value };
              }}
              value={form.value.acc}
            />
          </label>
        </div>
        <div class=" w-60 m-auto ">
          <label class=" flex justify-between">
            <span>密码🔑</span>
            <input
              autocomplete="true"
              type="password"
              name="pwd"
              onInput={(e) => {
                const { target } = e;
                form.value = { ...form.value, pwd: target!.value };
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
        disabled={loging.value}
        class="mt-8 mb-2 rounded-full text-white py-1  px-8 bg-sky-500 hover:bg-sky-600 active:bg-red-500 border-0"
      >
        提交🚀
      </button>
    </form>
  );
};
