export function youtubeEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const host = "https://www.youtube-nocookie.com/embed";
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.slice(1);
      return id ? `${host}/${id}` : null;
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      return id ? `${host}/${id}` : null;
    }
    return null;
  } catch {
    return null;
  }
}
