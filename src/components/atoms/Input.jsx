import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Input = React.forwardRef(({ 
  label,
  error,
  leftIcon,
  rightIcon,
  className,
  type = "text",
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-secondary-600 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <ApperIcon name={leftIcon} size={18} />
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          className={cn(
            "w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white",
            "focus:border-primary-500 focus:outline-none transition-all duration-200",
            "placeholder:text-gray-400",
            leftIcon && "pl-11",
            rightIcon && "pr-11",
            error && "border-error focus:border-error",
            className
          )}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <ApperIcon name={rightIcon} size={18} />
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-error flex items-center gap-1">
          <ApperIcon name="AlertCircle" size={14} />
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;