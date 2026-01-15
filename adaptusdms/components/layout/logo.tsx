import Link from "next/link";
import { Car } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <Link href="/dashboard" className={cn("flex items-center space-x-2", className)}>
      <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Car className="h-6 w-6" />
      </div>
      {showText && (
        <span className="text-xl font-bold text-foreground">Adaptus</span>
      )}
    </Link>
  );
}
