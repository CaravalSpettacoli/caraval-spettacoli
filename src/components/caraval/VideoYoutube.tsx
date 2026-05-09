import { Container } from "@/components/ui/Container";

function youtubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    return null;
  } catch {
    return null;
  }
}

export function VideoYoutube({
  url,
  eyebrow,
  heading,
  palette = "default",
}: {
  url?: string;
  eyebrow?: string;
  heading?: string;
  palette?: "default" | "imaginarium";
}) {
  if (!url) return null;
  const embed = youtubeEmbedUrl(url);
  if (!embed) return null;

  const isImag = palette === "imaginarium";
  const bg = isImag ? "bg-crema-base text-nero-base" : "bg-nero-base text-crema-base";
  const eyebrowCol = isImag ? "text-rosso-deep/80" : "text-rosso-base/90";
  const headingCol = isImag ? "text-rosso-deep" : "text-crema-base";
  const frameBg = isImag ? "bg-rosso-deep/10" : "bg-nero-deep";

  return (
    <section
      className={bg}
      style={{ paddingBlock: "var(--space-section-y, clamp(4rem, 8vw, 8rem))" }}
    >
      <Container width="narrow">
        {(eyebrow || heading) && (
          <div className="text-center mb-10 md:mb-12">
            {eyebrow && (
              <p className={`uppercase-tracked text-caption mb-3 ${eyebrowCol}`}>
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2 className={`font-display text-display-m leading-tight ${headingCol}`}>
                {heading}
              </h2>
            )}
          </div>
        )}
        <div
          className={`relative w-full overflow-hidden rounded-md ${frameBg} shadow-poster`}
          style={{ aspectRatio: "16/9" }}
        >
          <iframe
            src={embed}
            title={heading ?? "Video YouTube"}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </Container>
    </section>
  );
}

export default VideoYoutube;
