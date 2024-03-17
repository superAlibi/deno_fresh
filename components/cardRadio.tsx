import { JSX } from "preact/jsx-runtime";
export interface CardOption
  extends Omit<JSX.HTMLAttributes<HTMLOptionElement>, "className"> {
  labelIcon: JSX.Element;
}
export interface CardRadioProp {
  label: JSX.Element | string;
  options: CardOption[];
}
export function CardRadio({ label, options }: CardRadioProp) {
  return (
    <fieldset>
      <legend>{label}</legend>
      {options.map(({ labelIcon, label }) => {
        <label class="has-[:checked]:bg-indigo-50 has-[:checked]:text-indigo-900 has-[:checked]:ring-indigo-200 ..">
          {labelIcon}
          {label}
          <input type="radio" class="checked:border-indigo-500" />
        </label>;
      })}
    </fieldset>
  );
}
