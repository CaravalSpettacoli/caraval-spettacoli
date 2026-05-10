import {
  Theater,
  GraduationCap,
  Flame,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";

export type AreaIcona = "spettacolo" | "formazione" | "fuoco" | "generale";

export type AreaContatto = {
  icona?: AreaIcona;
  eyebrow?: string;
  titolo?: string;
  descrizione?: string;
  referente?: {
    nome?: string;
    telefonoPubblico?: string;
    emailPubblica?: string;
  };
  telefonoOverride?: string;
  emailOverride?: string;
};

const ICONS: Record<AreaIcona, LucideIcon> = {
  spettacolo: Theater,
  formazione: GraduationCap,
  fuoco: Flame,
  generale: MessageCircle,
};

function pulisciTel(tel?: string) {
  return tel ? tel.replace(/\s+/g, "") : "";
}

export function ContattiSezione({
  area,
  fallback,
}: {
  area: AreaContatto;
  fallback?: { email?: string; telefono?: string };
}) {
  const Icon = ICONS[area.icona ?? "generale"] ?? MessageCircle;
  const telefono =
    area.telefonoOverride ||
    area.referente?.telefonoPubblico ||
    fallback?.telefono;
  const email =
    area.emailOverride || area.referente?.emailPubblica || fallback?.email;

  return (
    <article className="flex flex-col gap-3 p-6 md:p-8 bg-nero-soft border border-crema-faint/30 hover:border-rosso-base/60 transition-colors duration-base">
      <div className="text-rosso-hover">
        <Icon size={36} strokeWidth={1.5} />
      </div>
      {area.eyebrow && (
        <p className="uppercase-tracked text-caption text-rosso-base/90">
          {area.eyebrow}
        </p>
      )}
      {area.titolo && (
        <h3 className="font-display text-h3 text-crema-base leading-tight">
          {area.titolo}
        </h3>
      )}
      {area.descrizione && (
        <p className="text-body text-crema-muted leading-relaxed">
          {area.descrizione}
        </p>
      )}
      {area.referente?.nome && (
        <p className="text-caption uppercase-tracked text-crema-base/65 mt-1">
          Referente: {area.referente.nome}
        </p>
      )}
      <div className="mt-auto pt-4 flex flex-col gap-1.5 text-body-s">
        {telefono && (
          <a
            href={`tel:${pulisciTel(telefono)}`}
            className="text-crema-base hover:text-rosso-hover transition-colors"
          >
            {telefono}
          </a>
        )}
        {email && (
          <a
            href={`mailto:${email}`}
            className="text-crema-base hover:text-rosso-hover transition-colors break-all"
          >
            {email}
          </a>
        )}
      </div>
    </article>
  );
}

export default ContattiSezione;
