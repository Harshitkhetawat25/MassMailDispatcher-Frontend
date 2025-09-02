import { cn } from "@/lib/utils";

export function ResponsiveContainer({ children, className, ...props }) {
  return (
    <div
      className={cn("w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function PageHeader({ title, description, children, className }) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6",
        className
      )}
    >
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}

export function MobileCard({ children, className, ...props }) {
  return (
    <div
      className={cn("border rounded-lg p-4 space-y-3 bg-card", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function DesktopTable({ children, className, ...props }) {
  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      <div className={cn("overflow-x-auto", className)} {...props}>
        {children}
      </div>
    </div>
  );
}
