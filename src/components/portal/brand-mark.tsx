import { cn } from "@/lib/utils";

/**
 * BOAZ360 mark: a gold-edged hexagon shield over the Boaz navy, drawn as SVG
 * so it stays crisp and needs no image asset.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 44"
      className={cn("h-10 w-9", className)}
      role="img"
      aria-label="BOAZ360"
    >
      <defs>
        <linearGradient id="boaz360-shield" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>
      </defs>
      <path
        d="M20 1.6 36.9 11v22L20 42.4 3.1 33V11z"
        fill="url(#boaz360-shield)"
        stroke="#D4AF37"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 14.5h7.2c2.7 0 4.4 1.4 4.4 3.7 0 1.6-.9 2.7-2.3 3.2 1.8.4 2.9 1.7 2.9 3.6 0 2.6-2 4.3-5 4.3h-7.2zm3.4 5.9h3.1c1.1 0 1.8-.6 1.8-1.5s-.7-1.4-1.8-1.4h-3.1zm0 6.2h3.4c1.2 0 1.9-.6 1.9-1.6s-.7-1.6-1.9-1.6h-3.4z"
        fill="#F8FAFC"
      />
    </svg>
  );
}

export function BrandWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-display text-xl font-semibold tracking-tight", className)}>
      <span className="text-white">BOAZ</span>
      <span className="text-[#D4AF37]">360</span>
    </span>
  );
}
