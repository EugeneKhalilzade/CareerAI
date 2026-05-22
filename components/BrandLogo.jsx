import Link from "next/link";
import { cn } from "@/lib/utils";

function BrandLogo({ href = "/", className, showTagline = false }) {
  return (
    <Link href={href} className={cn("inline-flex flex-col", className)}>
      <span className="text-2xl font-black tracking-tight text-white">
        Career
        <span className="relative ml-0.5 inline-block text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:bg-cyan-400/70 after:shadow-[0_0_8px_rgba(34,211,238,0.6)]">
          AI
        </span>
      </span>
      {showTagline && (
        <span className="mt-1 text-xs font-medium tracking-[0.12em] text-purple-400/80">
          Practice interviews with confidence
        </span>
      )}
    </Link>
  );
}

export default BrandLogo;
