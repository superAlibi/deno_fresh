import { JSX } from "preact/jsx-runtime";
export type SelectOption = JSX.HTMLAttributes<HTMLOptionElement>;
export interface SelectProp
  extends Omit<JSX.HTMLAttributes<HTMLSelectElement>, "className"> {
  label?: string;
  errormsg?: string;
  options?: SelectOption[];
}
export function Select(
  { label, options, errormsg, value, ...ops }: SelectProp,
) {
  const ComputedOptions = (options || []).map((i, index) => {
    const checked = i.value === value || i.checked || i.defaultChecked ||
      !index;
    return (
      <option
        checked={checked}
        {...i}
      >
        {i}
      </option>
    );
  });
  return (
    <label class="block">
      <span class="block text-sm font-medium text-slate-700">{label}</span>
      <select
        {...ops}
        class="rounded-md mt-1 py-2 border
         border-slate-300 text-sm shadow-sm  focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
         disabled:bg-slate-50 disabled:text-slate-500
          disabled:border-slate-200 disabled:shadow-none
         invalid:border-pink-500 invalid:text-pink-600
         focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
      >
        {ComputedOptions}
      </select>
      <p class="mt-2 invisible peer-invalid:visible text-pink-600 text-sm">
        {errormsg}
      </p>
    </label>
  );
}
