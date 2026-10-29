import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Logo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2 font-extrabold tracking-tight", className)}>
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-gradient text-sm font-black text-primary-foreground">
        U
      </span>
      <span className={cn("text-lg", inverted ? "text-sidebar-accent-foreground" : "text-foreground")}>
        Up<span className="text-primary">Creator</span>
      </span>
    </Link>
  );
}
