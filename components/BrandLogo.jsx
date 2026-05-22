import Link from "next/link";
import { cn } from "@/lib/utils";

function BrandLogo({ href = "/", className, showTagline = false }) {
  return (
    <Link href={href} className={cn("inline-flex flex-col", className)}>
      <span className="text-2xl font-black tracking-tight text-[#f5f0e8]">
        Career
        <span className="relative ml-0.5 inline-block text-[#d4af37] drop-shadow-[0_0_10px_rgba(212,175,55,0.42)] after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:bg-[#d4af37]/70 after:shadow-[0_0_8px_rgba(212,175,55,0.5)]">
          AI
        </span>
      </span>
      {showTagline && (
        <span className="mt-1 text-xs font-medium tracking-[0.12em] text-[#a08c4a]">
          Practice interviews with confidence
        </span>
      )}
    </Link>
  );
}

export default BrandLogo;
