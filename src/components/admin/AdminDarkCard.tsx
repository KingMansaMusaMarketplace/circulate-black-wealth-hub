import * as React from "react";
import { cn } from "@/lib/utils";

interface AdminDarkCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const AdminDarkCard = React.forwardRef<HTMLDivElement, AdminDarkCardProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border backdrop-blur-xl bg-slate-900/60 border-white/10 shadow-xl",
        className
      )}
      style={{ color: '#ffffff' }}
      {...props}
    >
      {children}
    </div>
  )
);
AdminDarkCard.displayName = "AdminDarkCard";

export const AdminDarkCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
AdminDarkCardHeader.displayName = "AdminDarkCardHeader";

export const AdminDarkCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-xl font-semibold leading-none tracking-tight", className)}
    style={{ color: '#ffffff' }}
    {...props}
  >
    {children}
  </h3>
));
AdminDarkCardTitle.displayName = "AdminDarkCardTitle";

export const AdminDarkCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm", className)}
    style={{ color: 'rgba(148, 163, 184, 0.9)' }}
    {...props}
  >
    {children}
  </p>
));
AdminDarkCardDescription.displayName = "AdminDarkCardDescription";

export const AdminDarkCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
AdminDarkCardContent.displayName = "AdminDarkCardContent";

export const AdminDarkCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
AdminDarkCardFooter.displayName = "AdminDarkCardFooter";
