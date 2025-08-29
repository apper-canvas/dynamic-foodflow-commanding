import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ 
  children, 
  variant = "default", 
  size = "sm",
  className,
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-gradient-to-r from-primary-500 to-primary-600 text-white",
    secondary: "bg-secondary-100 text-secondary-700",
    accent: "bg-gradient-to-r from-accent-500 to-success text-white",
    success: "bg-success/10 text-success border border-success/20",
    warning: "bg-warning/10 text-yellow-800 border border-warning/20",
error: "bg-error/10 text-error border border-error/20",
    veg: "bg-green-100 text-green-800 border border-green-200",
    nonveg: "bg-red-100 text-red-800 border border-red-200",
    jain: "bg-orange-100 text-orange-800 border border-orange-200",
    "allergen-free": "bg-blue-100 text-blue-800 border border-blue-200",
    danger: "bg-red-100 text-red-800 border border-red-200",
    offer: "bg-gradient-to-r from-primary-500 to-primary-600 text-white border-0 shadow-sm",
    "flash-sale": "bg-gradient-to-r from-accent-500 to-accent-600 text-white border-0 shadow-md animate-pulse",
    "limited-time": "bg-gradient-to-r from-warning to-primary-500 text-white border-0 shadow-sm"
  };

  const sizes = {
    xs: "px-2 py-0.5 text-xs",
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;