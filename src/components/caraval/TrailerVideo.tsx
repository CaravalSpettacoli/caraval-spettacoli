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

export function TrailerVideo({ url }: { url?: string }) {
  if (!url) return null;
  const embed = youtubeEmbedUrl(url);
  if (!embed) return null;
  return (
    <section className="bg-nero-base py-16 md:py-20">
      <Container width="narrow">
        <h2 className="uppercase-tracked text-caption text-rosso-base mb-6 text-center">
          Trailer
        </h2>
        <div
          className="relative w-full overflow-hidden rounded-md bg-nero-deep"
          style={{ aspectRatio: "16/9" }}
        >
          <iframe
            src={embed}
            title="Trailer YouTube"
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

export default TrailerVideo;
