"use client";
import Link from "next/link";
import { Button as ShadcnButton } from "@/components/ui/button";

const CustomButton = ({
  link,
  text,
  onClick,
  variant,
  size,
  className,
  type = "button",
  ...props
}) => {
  if (link) {
    return (
      <Link href={link} className={className}>
        <ShadcnButton
          variant={variant}
          size={size}
          className={className}
          {...props}
        >
          {text}
        </ShadcnButton>
      </Link>
    );
  } else {
    return (
      <ShadcnButton
        type={type}
        variant={variant}
        size={size}
        className={className}
        onClick={onClick}
        {...props}
      >
        {text}
      </ShadcnButton>
    );
  }
};

export default CustomButton;
