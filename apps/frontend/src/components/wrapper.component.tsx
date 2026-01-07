import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export const Wrapper = ({ children, className }: Props) => {
  return (
    <div className="main-full flex h-full">
      <div className={["flex grow h-full", className].join(" ")}>{children}</div>
    </div>
  );
};
