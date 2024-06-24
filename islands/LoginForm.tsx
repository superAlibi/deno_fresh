import { useSignal } from "@preact/signals";
import { CmmitInfo } from "../routes/api/user/login.ts";
import { http } from "../tools/http.ts";
import { useInit } from "../tools/hooks.ts";
import { JSXInternal } from "https://esm.sh/v128/preact@10.19.6/src/jsx.d.ts";

export default (p: JSXInternal.HTMLAttributes<HTMLFormElement>) => {
  useInit();
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
    http.post("/user/login", {
      data: form.value,
    }).then(() => {
      location.href = "/admin";
    }, (e) => {
      console.error(e);

      errorInfo.value = e.message;
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
          <label class="items-center flex justify-between">
            <span class="whitespace-nowrap">账户👨‍✈️</span>
            <input
              name="acc"
              onInput={(e) => {
                form.value = { ...form.value, acc: e.currentTarget.value };
              }}
              value={form.value.acc}
            />
          </label>
        </div>
        <div class=" w-60 m-auto ">
          <label class="items-center  flex justify-between">
            <span class="whitespace-nowrap">密码🔑</span>
            <input
              autocomplete="true"
              type="password"
              name="pwd"
              onInput={(e) => {
                const { currentTarget } = e;
                form.value = { ...form.value, pwd: currentTarget.value };
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
