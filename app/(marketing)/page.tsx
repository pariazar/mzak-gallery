import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/home/hero";
import { ArtSeparator } from "@/components/art/art-separator";

/** Below-fold sections load after the hero shell — keeps the first JS chunk lean. */
const ClientsMarquee = dynamic(
  () =>
    import("@/components/sections/home/clients-marquee").then(
      (m) => m.ClientsMarquee,
    ),
);
const StoryPrologue = dynamic(
  () =>
    import("@/components/sections/home/story-prologue").then(
      (m) => m.StoryPrologue,
    ),
);
const StoryInkConstellation = dynamic(
  () =>
    import("@/components/sections/home/story-ink-constellation").then(
      (m) => m.StoryInkConstellation,
    ),
);
const ScrollPainting = dynamic(
  () =>
    import("@/components/sections/home/scroll-painting").then(
      (m) => m.ScrollPainting,
    ),
);
const StoryWashCollide = dynamic(
  () =>
    import("@/components/sections/home/story-wash-collide").then(
      (m) => m.StoryWashCollide,
    ),
);
const StoryPigment = dynamic(
  () =>
    import("@/components/sections/home/story-pigment").then(
      (m) => m.StoryPigment,
    ),
);
const StoryBrushScript = dynamic(
  () =>
    import("@/components/sections/home/story-brush-script").then(
      (m) => m.StoryBrushScript,
    ),
);
const StoryGalleryWalk = dynamic(
  () =>
    import("@/components/sections/home/story-gallery-walk").then(
      (m) => m.StoryGalleryWalk,
    ),
);
const StoryDetail = dynamic(
  () =>
    import("@/components/sections/home/story-detail").then(
      (m) => m.StoryDetail,
    ),
);
const StoryAtelierDesk = dynamic(
  () =>
    import("@/components/sections/home/story-atelier-desk").then(
      (m) => m.StoryAtelierDesk,
    ),
);
const StoryManifesto = dynamic(
  () =>
    import("@/components/sections/home/story-manifesto").then(
      (m) => m.StoryManifesto,
    ),
);
const FeaturedWork = dynamic(
  () =>
    import("@/components/sections/home/featured-work").then(
      (m) => m.FeaturedWork,
    ),
);
const Manifesto = dynamic(
  () =>
    import("@/components/sections/home/manifesto").then((m) => m.Manifesto),
);
const Services = dynamic(
  () =>
    import("@/components/sections/home/services").then((m) => m.Services),
);
const StoryEpilogue = dynamic(
  () =>
    import("@/components/sections/home/story-epilogue").then(
      (m) => m.StoryEpilogue,
    ),
);
const Testimonial = dynamic(
  () =>
    import("@/components/sections/home/testimonial").then(
      (m) => m.Testimonial,
    ),
);

/**
 * Graphical scroll story — painted separators between atelier chapters.
 */
export default function HomePage() {
  return (
    <main>
      <Hero />
      <ArtSeparator variant="stroke" />
      <ClientsMarquee />
      <ArtSeparator variant="drip" />
      <StoryPrologue />
      <ArtSeparator variant="bloom" />
      <StoryInkConstellation />
      <ArtSeparator variant="ribbon" />
      <ScrollPainting />
      <ArtSeparator variant="tear" />
      <StoryWashCollide />
      <ArtSeparator variant="bloom" />
      <StoryPigment />
      <ArtSeparator variant="stroke" />
      <StoryBrushScript />
      <ArtSeparator variant="drip" />
      <StoryGalleryWalk />
      <ArtSeparator variant="ribbon" />
      <StoryDetail />
      <ArtSeparator variant="tear" />
      <StoryAtelierDesk />
      <ArtSeparator variant="bloom" />
      <StoryManifesto />
      <ArtSeparator variant="stroke" />
      <FeaturedWork />
      <ArtSeparator variant="drip" />
      <Manifesto />
      <ArtSeparator variant="ribbon" />
      <Services />
      <ArtSeparator variant="tear" />
      <StoryEpilogue />
      <ArtSeparator variant="stroke" />
      <Testimonial />
    </main>
  );
}
