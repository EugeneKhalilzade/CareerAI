import { cn } from "@/lib/utils";

function DarkShell({ children, className }) {
  return (
    <div
      className={cn(
        "relative min-h-screen overflow-hidden bg-[#06180d] text-white",
        className
      )}
    >
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_62%_42%,rgba(67,48,112,0.48),transparent_32%),radial-gradient(circle_at_42%_38%,rgba(21,37,39,0.72),transparent_36%),radial-gradient(circle_at_15%_30%,rgba(6,42,22,0.62),transparent_28%),linear-gradient(180deg,#071d10_0%,#06180d_48%,#041208_100%)]" />
      {children}
    </div>
  );
}

export default DarkShell;
