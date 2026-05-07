export function TicketWatermark() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="none"
      viewBox="0 0 400 150"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="ticket-wave-pattern"
          x="0"
          y="0"
          width="80"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0,10 Q20,0 40,10 T80,10"
            fill="none"
            stroke="var(--color-rosso-base)"
            strokeWidth="0.5"
            opacity="0.07"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ticket-wave-pattern)" />
    </svg>
  );
}
