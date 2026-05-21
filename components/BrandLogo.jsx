import Link from "next/link";
import { cn } from "@/lib/utils";

function BrandLogo({ href = "/", className, showTagline = false }) {
  return (
    <Link href={href} className={cn("inline-flex flex-col", className)}>
      <span className="text-2xl font-extrabold tracking-tight text-slate-900">
        Career<span className="brand-highlight">A</span>I
      </span>
      {showTagline && (
        <span className="text-xs font-medium text-slate-500">
          Practice interviews with confidence
        </span>
      )}
    </Link>
  );
}

export default BrandLogo;
