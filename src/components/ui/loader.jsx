import { cn } from "@/lib/utils";

export default function Loader({
  width = "w-5",
  height = "h-5",
  border = "border-2",
  color = "border-primary",
  size,
  fullScreen = false,
  className,
  ...props
}) {
  // Size variants
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    default: "w-5 h-5 border-2",
    lg: "w-8 h-8 border-2",
    xl: "w-12 h-12 border-4",
  };

  const loaderClasses = size
    ? sizeClasses[size]
    : `${width} ${height} ${border}`;

  const spinner = (
    <div
      className={cn(
        "border-t-transparent rounded-full animate-spin",
        loaderClasses,
        color,
        className
      )}
      {...props}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
}
