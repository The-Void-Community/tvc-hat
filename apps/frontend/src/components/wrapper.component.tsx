import type { ReactNode } from "react"

type Props = {
  children: ReactNode;
  className?: string
}

export const Wrapper = ({ children, className }: Props) => {
  return (
    <div className="main-full flex">
      <div className={[
        "flex grow",
        className
      ].join(" ")}>
        {children}
      </div>
    </div>
  )
}