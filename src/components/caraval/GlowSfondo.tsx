/** Glow sfondo cremisi pulsante. Usato come decoration su sezioni alternate
 *  per ritmo visivo "nero-magenta" dinamico (Hotfix 4 §9).
 *
 *  - Server Component (CSS pure, no state)
 *  - Posizione configurabile via prop
 *  - Animazione pulse 8s gestita da .glow-sfondo class in globals.css
 *  - prefers-reduced-motion: animation: none */
export function GlowSfondo({
  posizione = "center",
  intensita = "medium",
}: {
  posizione?: "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
  intensita?: "low" | "medium" | "high";
}) {
  const positions: Record<string, string> = {
    center: "50% 50%",
    "top-left": "20% 30%",
    "top-right": "80% 30%",
    "bottom-left": "20% 70%",
    "bottom-right": "80% 70%",
  };
  const alpha: Record<string, number> = {
    low: 0.15,
    medium: 0.25,
    high: 0.35,
  };

  return (
    <div
      aria-hidden
      className="glow-sfondo"
      style={{
        background: `radial-gradient(circle at ${positions[posizione]}, rgba(168, 23, 74, ${alpha[intensita]}) 0%, transparent 60%)`,
      }}
    />
  );
}

export default GlowSfondo;
