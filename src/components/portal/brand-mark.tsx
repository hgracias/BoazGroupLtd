import Image from "next/image";

import { company } from "@/lib/company";
import { cn } from "@/lib/utils";

/**
 * The company logo, same asset as the public site. It is navy artwork on
 * white, so on the dark portal it sits on a white disc with a gold hairline.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative block h-11 w-11 shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-[#D4AF37]/50",
        className
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
  );
}

export function BrandWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex min-w-0 flex-col leading-none", className)}>
      <span className="truncate font-display text-lg font-semibold tracking-tight text-white">
        Boaz Group <span className="font-normal">Ltd</span>
      </span>
      <span className="mt-1 truncate text-[9px] font-medium uppercase tracking-[0.14em] text-white/50">
        {company.tagline}
      </span>
    </span>
  );
}
