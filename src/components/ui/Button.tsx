"use client";

import { motion } from "framer-motion";
import Link from "next/link";

type BaseProps = {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
};

type ButtonProps = BaseProps &
  (
    | ({ as?: "button" } & React.ButtonHTMLAttributes<HTMLButtonElement>)
    | ({ as: "a"; href: string; external?: boolean })
    | ({ as: "link"; href: string })
  );

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  const baseClass =
    "inline-flex items-center justify-center font-semibold cursor-pointer select-none transition-all";

  const variantClass = {
    primary: "bg-maroon text-cream",
    outline: "border-2 border-maroon text-maroon bg-transparent",
    ghost: "text-maroon bg-transparent",
  }[variant];

  const sizeClass = {
    sm: "px-4 py-2 text-sm rounded-btn gap-1.5",
    md: "px-6 py-3 text-base rounded-btn gap-2",
    lg: "px-8 py-4 text-lg rounded-btn gap-2.5",
  }[size];

  const classes = `${baseClass} ${variantClass} ${sizeClass} ${className}`;

  if (rest.as === "a") {
    const { as: _as, external, href, ...aRest } = rest as { as: "a"; href: string; external?: boolean };
    return (
      <motion.a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={classes}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...(aRest as object)}
      >
        {children}
      </motion.a>
    );
  }

  if (rest.as === "link") {
    const { as: _as, href, ...linkRest } = rest as { as: "link"; href: string };
    return (
      <Link href={href} className={classes} {...(linkRest as object)}>
        {children}
      </Link>
    );
  }

  const { as: _as, ...btnRest } = rest as { as?: "button" } & React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <motion.button
      className={classes}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...(btnRest as object)}
    >
      {children}
    </motion.button>
  );
}
