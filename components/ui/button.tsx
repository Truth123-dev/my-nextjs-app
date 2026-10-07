import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm";
};

const variants = {
  default: "bg-slate-900 text-white hover:bg-slate-700 disabled:opacity-50",
  outline:
    "border border-slate-300 bg-transparent hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800",
  ghost:
    "bg-transparent hover:bg-slate-100 disabled:opacity-50 dark:hover:bg-slate-800",
};

const sizes = {
  default: "h-10 px-4 py-2",
  sm: "h-9 px-3 text-sm",
};

export function Button({
  className,
  variant = "default",
  size = "default",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
