import React from "react";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({ 
  children, 
  variant = "default", 
  hover = false,
  className,
  ...props 
}, ref) => {
  const variants = {
    default: "bg-white shadow-sm border border-gray-100",
    elevated: "bg-white shadow-lg border-0",
    gradient: "bg-gradient-to-br from-white to-gray-50 shadow-md border border-gray-100",
    glassmorphism: "bg-white/80 backdrop-blur-sm shadow-lg border border-white/20"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl p-6 transition-all duration-200",
        variants[variant],
        hover && "hover:shadow-lg hover:scale-[1.02] cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;