"use client";

import type { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";

export const BUTTON_VARIANTS = [
  "default",
  "primary",
  "danger",
  "secondary",
  "tetriary",
] as const;

type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

type Props = {
  children: ReactNode;
  variant?: (typeof BUTTON_VARIANTS)[number];
} & ButtonProps;

export const Button = ({
  children,
  variant = "default",
  className,
  ...props
}: Props) => {
  return (
    <button
      {...props}
      className={[
        "bg-(--fg-card) px-4 py-2 rounded-lg page",
        `color-${variant}`,
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
};
