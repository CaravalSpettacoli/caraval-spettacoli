import { cn } from "@/lib/cn";

export interface CreditoLocandina {
  /** Etichetta uppercase, es. "REGIA". Solo lettere/spazi/numeri. */
  ruolo: string;
  /** Nome completo. */
  nome: string;
}

interface CreditiLocandinaProps {
  crediti: CreditoLocandina[];
  className?: string;
}

export function CreditiLocandina({
  crediti,
  className,
}: CreditiLocandinaProps) {
  return (
    <dl
      className={cn(
        "flex flex-col gap-2 font-sans text-body-s",
        className,
      )}
    >
      {crediti.map((c, i) => (
        <div key={i} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <dt className="uppercase tracking-[0.15em] text-label text-rosso-base font-semibold min-w-[140px] shrink-0">
            {c.ruolo}
          </dt>
          <span aria-hidden="true" className="text-rosso-base/60">
            —
          </span>
          <dd className="text-crema-base">{c.nome}</dd>
        </div>
      ))}
    </dl>
  );
}

export default CreditiLocandina;
