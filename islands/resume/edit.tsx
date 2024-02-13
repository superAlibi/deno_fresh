import { JSX } from "preact";

export default ({ open }: Partial<JSX.HTMLAttributes<HTMLDialogElement>>) => {
  return (
    <dialog open={open}>
      msg
    </dialog>
  );
};
