import Image from "next/image";
import Link from "next/link";

import { company } from "@/lib/company";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  tone = "dark",
  showTagline = true,
}: {
  className?: string;
  tone?: "dark" | "light";
  showTagline?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-3", className)}
      aria-label={`${company.name} — home`}
    >
      <span
        className={cn(
          "relative block h-11 w-11 shrink-0 overflow-hidden rounded-full ring-1",
          tone === "light" ? "bg-white ring-white/40" : "bg-white ring-navy-100"
        )}
      >
        <Image
          src={company.logo}
          alt=""
          fill
          sizes="44px"
          className="object-cover"
          priority
        />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-lg font-semibold tracking-tight",
            tone === "light" ? "text-white" : "text-navy-900"
          )}
        >
          Boaz Group <span className="font-normal">Ltd</span>
        </span>
        {showTagline ? (
          <span
            className={cn(
              "mt-1 text-[10px] font-medium uppercase tracking-[0.16em]",
              tone === "light" ? "text-white/60" : "text-muted-foreground"
            )}
          >
            {company.tagline}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
