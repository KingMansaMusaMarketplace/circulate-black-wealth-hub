// Click-to-play clip: nothing downloads until the visitor presses play, so pages stay fast.
export default function ClinicalVideo({ src, poster, title, label }: { src: string; poster: string; title: string; label: string }) {
  return <figure className="overflow-hidden rounded-xl border border-border bg-card">
    <video controls playsInline muted preload="none" poster={poster} aria-label={title} className="aspect-video w-full bg-background object-cover">
      <source src={src} type="video/mp4" />
    </video>
    <figcaption className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
      <span className="font-semibold">{title}</span>
      <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">{label}</span>
    </figcaption>
  </figure>;
}
