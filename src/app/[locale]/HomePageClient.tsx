"use client";

import { useState, Suspense, lazy } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Check,
  ChevronDown,
  Clock,
  Coins,
  Dices,
  Dna,
  ExternalLink,
  Flame,
  Gem,
  Gift,
  Layers,
  Link as LinkIcon,
  RefreshCw,
  ScrollText,
  Swords,
  Sparkles,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  locale: string;
}

// 兑换码奖励类型 → 图标
const REWARD_ICONS: Record<string, typeof Coins> = {
  Gems: Coins,
  RR: RefreshCw,
  Cubes: Layers,
  Malice: Flame,
};

// 档位语义配色（Tailwind 调色板，非硬编码 hex）
const TIER_STYLES: Record<string, string> = {
  S: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  A: "text-sky-400 bg-sky-500/10 border-sky-500/30",
  B: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  C: "text-[hsl(var(--nav-theme-light))] bg-[hsl(var(--nav-theme)/0.1)] border-[hsl(var(--nav-theme)/0.3)]",
  D: "text-slate-400 bg-slate-500/10 border-slate-500/30",
};

const PRIORITY_STYLES: Record<string, string> = {
  Early: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  Mid: "text-sky-400 bg-sky-500/10 border-sky-500/30",
  Late: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  Flexible: "text-[hsl(var(--nav-theme-light))] bg-[hsl(var(--nav-theme)/0.1)] border-[hsl(var(--nav-theme)/0.3)]",
};

function rarityStyle(rarity: string): string {
  const r = rarity.toLowerCase();
  if (r.includes("secret")) return "text-amber-400 bg-amber-500/10 border-amber-500/30";
  if (r.includes("mythic")) return "text-[hsl(var(--nav-theme-light))] bg-[hsl(var(--nav-theme)/0.1)] border-[hsl(var(--nav-theme)/0.3)]";
  if (r.includes("legendary")) return "text-sky-400 bg-sky-500/10 border-sky-500/30";
  return "text-slate-400 bg-slate-500/10 border-slate-500/30";
}

export default function HomePageClient({
  latestArticles,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.animedestiny.wiki";

  const [storyExpanded, setStoryExpanded] = useState<number | null>(null);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Anime Destiny Wiki",
        description:
          "Anime Destiny Wiki covers Roblox codes, tier list, units, traits, evolutions, story stages, raids, bosses, and beginner tips for tower defense players.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Anime Destiny - Roblox Anime Tower Defense",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Anime Destiny Wiki",
        alternateName: "Anime Destiny",
        url: siteUrl,
        description:
          "Anime Destiny Wiki resource hub for Roblox codes, tier list, units, traits, evolutions, story stages, raids, and boss guides",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Anime Destiny Wiki - Roblox Anime Tower Defense",
        },
        sameAs: [
          "https://www.roblox.com/games/82674355647259/Anime-Destiny",
          "https://www.roblox.com/communities/859372599/Anime-Destiny-AD",
          "https://discord.com/invite/animedestiny",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Anime Destiny",
        gamePlatform: ["PC", "Mac", "Mobile", "Console"],
        applicationCategory: "Game",
        genre: ["Tower Defense", "Anime", "Strategy", "Roblox"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 1,
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://www.roblox.com/games/82674355647259/Anime-Destiny",
        },
      },
      {
        "@type": "VideoObject",
        name: "Anime Destiny | Release Trailer",
        description:
          "Anime Destiny release trailer showcasing anime units, upgrades, evolutions, story stages, bosses, and endless trials gameplay.",
        uploadDate: "2026-06-21",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/pdSziNF8tEs",
        url: "https://www.youtube.com/watch?v=pdSziNF8tEs",
      },
    ],
  };

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("anime-destiny-codes")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <Gift className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://www.roblox.com/games/82674355647259/Anime-Destiny"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnRobloxCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section - 紧跟 Hero 区域 */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="pdSziNF8tEs"
              title="Anime Destiny | Release Trailer"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 8 Navigation Cards（模块导航区，位于视频区之后） */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            <a
              href="#anime-destiny-codes"
              onClick={(e) => { e.preventDefault(); scrollToSection("anime-destiny-codes"); }}
              className="scroll-reveal group rounded-xl border border-border p-4 md:p-6 bg-card hover:border-[hsl(var(--nav-theme)/0.5)] transition-all duration-300 cursor-pointer text-left hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
            >
              <div className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12 bg-[hsl(var(--nav-theme)/0.1)] flex items-center justify-center group-hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors">
                <DynamicIcon name={t.tools.cards[0].icon} className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]" />
              </div>
              <h3 className="mb-1.5 text-sm md:text-base font-semibold">{t.tools.cards[0].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[0].description}</p>
            </a>
            <a
              href="#anime-destiny-beginner-guide"
              onClick={(e) => { e.preventDefault(); scrollToSection("anime-destiny-beginner-guide"); }}
              className="scroll-reveal group rounded-xl border border-border p-4 md:p-6 bg-card hover:border-[hsl(var(--nav-theme)/0.5)] transition-all duration-300 cursor-pointer text-left hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
            >
              <div className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12 bg-[hsl(var(--nav-theme)/0.1)] flex items-center justify-center group-hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors">
                <DynamicIcon name={t.tools.cards[1].icon} className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]" />
              </div>
              <h3 className="mb-1.5 text-sm md:text-base font-semibold">{t.tools.cards[1].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[1].description}</p>
            </a>
            <a
              href="#anime-destiny-unit-tier-list"
              onClick={(e) => { e.preventDefault(); scrollToSection("anime-destiny-unit-tier-list"); }}
              className="scroll-reveal group rounded-xl border border-border p-4 md:p-6 bg-card hover:border-[hsl(var(--nav-theme)/0.5)] transition-all duration-300 cursor-pointer text-left hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
            >
              <div className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12 bg-[hsl(var(--nav-theme)/0.1)] flex items-center justify-center group-hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors">
                <DynamicIcon name={t.tools.cards[2].icon} className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]" />
              </div>
              <h3 className="mb-1.5 text-sm md:text-base font-semibold">{t.tools.cards[2].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[2].description}</p>
            </a>
            <a
              href="#anime-destiny-traits-reroll"
              onClick={(e) => { e.preventDefault(); scrollToSection("anime-destiny-traits-reroll"); }}
              className="scroll-reveal group rounded-xl border border-border p-4 md:p-6 bg-card hover:border-[hsl(var(--nav-theme)/0.5)] transition-all duration-300 cursor-pointer text-left hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
            >
              <div className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12 bg-[hsl(var(--nav-theme)/0.1)] flex items-center justify-center group-hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors">
                <DynamicIcon name={t.tools.cards[3].icon} className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]" />
              </div>
              <h3 className="mb-1.5 text-sm md:text-base font-semibold">{t.tools.cards[3].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[3].description}</p>
            </a>
            <a
              href="#anime-destiny-summon-gems"
              onClick={(e) => { e.preventDefault(); scrollToSection("anime-destiny-summon-gems"); }}
              className="scroll-reveal group rounded-xl border border-border p-4 md:p-6 bg-card hover:border-[hsl(var(--nav-theme)/0.5)] transition-all duration-300 cursor-pointer text-left hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
            >
              <div className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12 bg-[hsl(var(--nav-theme)/0.1)] flex items-center justify-center group-hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors">
                <DynamicIcon name={t.tools.cards[4].icon} className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]" />
              </div>
              <h3 className="mb-1.5 text-sm md:text-base font-semibold">{t.tools.cards[4].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[4].description}</p>
            </a>
            <a
              href="#anime-destiny-evolution-materials"
              onClick={(e) => { e.preventDefault(); scrollToSection("anime-destiny-evolution-materials"); }}
              className="scroll-reveal group rounded-xl border border-border p-4 md:p-6 bg-card hover:border-[hsl(var(--nav-theme)/0.5)] transition-all duration-300 cursor-pointer text-left hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
            >
              <div className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12 bg-[hsl(var(--nav-theme)/0.1)] flex items-center justify-center group-hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors">
                <DynamicIcon name={t.tools.cards[5].icon} className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]" />
              </div>
              <h3 className="mb-1.5 text-sm md:text-base font-semibold">{t.tools.cards[5].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[5].description}</p>
            </a>
            <a
              href="#anime-destiny-story-bosses-endless"
              onClick={(e) => { e.preventDefault(); scrollToSection("anime-destiny-story-bosses-endless"); }}
              className="scroll-reveal group rounded-xl border border-border p-4 md:p-6 bg-card hover:border-[hsl(var(--nav-theme)/0.5)] transition-all duration-300 cursor-pointer text-left hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
            >
              <div className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12 bg-[hsl(var(--nav-theme)/0.1)] flex items-center justify-center group-hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors">
                <DynamicIcon name={t.tools.cards[6].icon} className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]" />
              </div>
              <h3 className="mb-1.5 text-sm md:text-base font-semibold">{t.tools.cards[6].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[6].description}</p>
            </a>
            <a
              href="#anime-destiny-official-links"
              onClick={(e) => { e.preventDefault(); scrollToSection("anime-destiny-official-links"); }}
              className="scroll-reveal group rounded-xl border border-border p-4 md:p-6 bg-card hover:border-[hsl(var(--nav-theme)/0.5)] transition-all duration-300 cursor-pointer text-left hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
            >
              <div className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12 bg-[hsl(var(--nav-theme)/0.1)] flex items-center justify-center group-hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors">
                <DynamicIcon name={t.tools.cards[7].icon} className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]" />
              </div>
              <h3 className="mb-1.5 text-sm md:text-base font-semibold">{t.tools.cards[7].title}</h3>
              <p className="text-sm text-muted-foreground">{t.tools.cards[7].description}</p>
            </a>
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Module 1: Anime Destiny Codes */}
      <section id="anime-destiny-codes" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <Gift className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                {t.modules.animeDestinyCodes.title}
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.animeDestinyCodes.intro}
            </p>
          </div>

          {/* Active Codes */}
          <div className="scroll-reveal mb-8 md:mb-10">
            <h3 className="flex items-center gap-2 text-lg md:text-xl font-bold mb-4">
              <BadgeCheck className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              Active Codes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {t.modules.animeDestinyCodes.activeCodes.map((code: any, index: number) => (
                <div
                  key={index}
                  className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <code className="px-3 py-1.5 rounded-lg bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.3)] font-mono text-sm md:text-base font-semibold text-[hsl(var(--nav-theme-light))]">
                      {code.code}
                    </code>
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                      <Check className="w-3 h-3" />
                      {code.status}
                    </span>
                  </div>
                  <p className="text-sm font-semibold mb-1.5">Rewards: {code.rewards}</p>
                  <p className="text-sm text-muted-foreground">{code.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Reward Types */}
          <div className="scroll-reveal mb-8 md:mb-10">
            <h3 className="text-lg md:text-xl font-bold mb-4">Reward Types</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {t.modules.animeDestinyCodes.rewardTypes.map((r: any, index: number) => {
                const RewardIcon = REWARD_ICONS[r.name] || Gift;
                return (
                  <div
                    key={index}
                    className="p-4 bg-white/5 border border-border rounded-xl text-center"
                  >
                    <RewardIcon className="w-6 h-6 text-[hsl(var(--nav-theme-light))] mx-auto mb-2" />
                    <p className="font-semibold text-sm mb-1">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.use}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* How to Redeem */}
          <div className="scroll-reveal mb-8 md:mb-10">
            <h3 className="text-lg md:text-xl font-bold mb-4">How to Redeem</h3>
            <div className="space-y-3">
              {t.modules.animeDestinyCodes.redeemSteps.map((step: string, index: number) => (
                <div
                  key={index}
                  className="flex gap-3 md:gap-4 p-4 bg-white/5 border border-border rounded-xl"
                >
                  <div className="flex h-9 w-9 md:h-10 md:w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                    <span className="text-sm md:text-base font-bold text-[hsl(var(--nav-theme-light))]">
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-sm md:text-base text-muted-foreground self-center">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Expired Codes */}
          <div className="scroll-reveal p-4 md:p-6 bg-white/[0.02] border border-border rounded-xl">
            <h3 className="text-lg md:text-xl font-bold mb-4">Expired Codes</h3>
            <div className="flex flex-wrap gap-2">
              {t.modules.animeDestinyCodes.expiredCodes.map((code: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-md bg-white/5 border border-border font-mono text-xs text-muted-foreground line-through"
                >
                  {code}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Anime Destiny Beginner Guide */}
      <section id="anime-destiny-beginner-guide" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <BookOpen className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                {t.modules.animeDestinyBeginnerGuide.title}
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.animeDestinyBeginnerGuide.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-3 md:space-y-4">
            {t.modules.animeDestinyBeginnerGuide.steps.map((step: any, index: number) => (
              <div
                key={index}
                className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                  <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                    {index + 1}
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-2">
                    {step.description}
                  </p>
                  <p className="flex items-start gap-2 text-sm text-[hsl(var(--nav-theme-light))]">
                    <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{step.tip}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 3: Anime Destiny Unit Tier List */}
      <section id="anime-destiny-unit-tier-list" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <Trophy className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                {t.modules.animeDestinyUnitTierList.title}
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.animeDestinyUnitTierList.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-6">
            {t.modules.animeDestinyUnitTierList.tiers.map((tier: any, ti: number) => (
              <div key={ti} className="relative pl-4 md:pl-6">
                <div className="absolute left-0 top-0 h-full w-1 rounded-full bg-[hsl(var(--nav-theme)/0.3)]" />
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl border text-lg md:text-xl font-bold ${TIER_STYLES[tier.tier] || TIER_STYLES.D}`}
                  >
                    {tier.tier}
                  </span>
                  <h3 className="text-lg md:text-xl font-bold">{tier.label}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {tier.units.map((unit: any, ui: number) => (
                    <div
                      key={ui}
                      className="p-4 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h4 className="font-semibold">{unit.name}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full border whitespace-nowrap ${rarityStyle(unit.rarity)}`}>
                          {unit.rarity}
                        </span>
                      </div>
                      <p className="text-xs text-[hsl(var(--nav-theme-light))] mb-2">{unit.role}</p>
                      <p className="text-sm text-muted-foreground">{unit.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 4: Anime Destiny Traits and Reroll Guide */}
      <section id="anime-destiny-traits-reroll" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <Dices className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                {t.modules.animeDestinyTraitsAndReroll.title}
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.animeDestinyTraitsAndReroll.intro}
            </p>
          </div>

          {/* Desktop table */}
          <div className="scroll-reveal hidden md:block overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-white/5">
                <tr className="text-left">
                  <th className="px-4 py-3 font-semibold">Trait / Resource</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Best For</th>
                  <th className="px-4 py-3 font-semibold">Advice</th>
                </tr>
              </thead>
              <tbody>
                {t.modules.animeDestinyTraitsAndReroll.rows.map((row: any, index: number) => (
                  <tr key={index} className="border-t border-border align-top">
                    <td className="px-4 py-3 font-semibold text-[hsl(var(--nav-theme-light))] whitespace-nowrap">
                      {row.trait}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                        {row.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{row.bestFor}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.advice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile stacked cards */}
          <div className="scroll-reveal md:hidden space-y-3">
            {t.modules.animeDestinyTraitsAndReroll.rows.map((row: any, index: number) => (
              <div key={index} className="p-4 bg-white/5 border border-border rounded-xl">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h4 className="font-semibold text-[hsl(var(--nav-theme-light))]">{row.trait}</h4>
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                    {row.type}
                  </span>
                </div>
                <p className="text-sm mb-1.5"><span className="text-muted-foreground">Best for: </span>{row.bestFor}</p>
                <p className="text-sm text-muted-foreground">{row.advice}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 5: 移动端横幅 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 5: Anime Destiny Summon and Gems Guide */}
      <section id="anime-destiny-summon-gems" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <Gem className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                {t.modules.animeDestinySummonAndGems.title}
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.animeDestinySummonAndGems.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {t.modules.animeDestinySummonAndGems.cards.map((card: any, index: number) => (
              <div
                key={index}
                className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <h3 className="font-bold text-lg mb-2 text-[hsl(var(--nav-theme-light))]">
                  {card.name}
                </h3>
                <p className="text-muted-foreground text-sm">{card.description}</p>
              </div>
            ))}
          </div>

          <div className="scroll-reveal p-4 md:p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <h3 className="flex items-center gap-2 font-bold text-base md:text-lg mb-3 md:mb-4">
              <Check className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              Smart Spending Tips
            </h3>
            <ul className="space-y-2">
              {t.modules.animeDestinySummonAndGems.tips.map((tip: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Module 6: Anime Destiny Evolution and Upgrade Materials */}
      <section id="anime-destiny-evolution-materials" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <Dna className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                {t.modules.animeDestinyEvolutionMaterials.title}
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.animeDestinyEvolutionMaterials.intro}
            </p>
          </div>

          {/* Desktop table */}
          <div className="scroll-reveal hidden md:block overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-white/5">
                <tr className="text-left">
                  <th className="px-4 py-3 font-semibold">Material</th>
                  <th className="px-4 py-3 font-semibold">Source</th>
                  <th className="px-4 py-3 font-semibold">Priority</th>
                  <th className="px-4 py-3 font-semibold">Use</th>
                </tr>
              </thead>
              <tbody>
                {t.modules.animeDestinyEvolutionMaterials.rows.map((row: any, index: number) => (
                  <tr key={index} className="border-t border-border align-top">
                    <td className="px-4 py-3 font-semibold text-[hsl(var(--nav-theme-light))] whitespace-nowrap">
                      {row.material}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{row.source}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full border whitespace-nowrap ${PRIORITY_STYLES[row.priority] || PRIORITY_STYLES.Flexible}`}>
                        {row.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{row.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile stacked cards */}
          <div className="scroll-reveal md:hidden space-y-3">
            {t.modules.animeDestinyEvolutionMaterials.rows.map((row: any, index: number) => (
              <div key={index} className="p-4 bg-white/5 border border-border rounded-xl">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h4 className="font-semibold text-[hsl(var(--nav-theme-light))]">{row.material}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full border whitespace-nowrap ${PRIORITY_STYLES[row.priority] || PRIORITY_STYLES.Flexible}`}>
                    {row.priority}
                  </span>
                </div>
                <p className="text-sm mb-1.5"><span className="text-muted-foreground">Source: </span>{row.source}</p>
                <p className="text-sm text-muted-foreground">{row.use}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 7: Anime Destiny Story Stages, Bosses, and Endless Trials */}
      <section id="anime-destiny-story-bosses-endless" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <Swords className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                {t.modules.animeDestinyStoryBossesEndless.title}
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.animeDestinyStoryBossesEndless.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-2">
            {t.modules.animeDestinyStoryBossesEndless.items.map((item: any, index: number) => (
              <div
                key={index}
                className="border border-border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setStoryExpanded(storyExpanded === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-semibold pr-3">{item.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 transition-transform ${storyExpanded === index ? "rotate-180" : ""}`}
                  />
                </button>
                {storyExpanded === index && (
                  <div className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 8: Anime Destiny Official Links and Update Tracker */}
      <section id="anime-destiny-official-links" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <LinkIcon className="w-7 h-7 md:w-8 md:h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-3xl md:text-5xl font-bold">
                {t.modules.animeDestinyOfficialLinks.title}
              </h2>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t.modules.animeDestinyOfficialLinks.intro}
            </p>
          </div>

          {/* Official Links */}
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {t.modules.animeDestinyOfficialLinks.links.map((link: any, index: number) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors flex flex-col"
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <h3 className="font-bold text-lg text-[hsl(var(--nav-theme-light))]">{link.name}</h3>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-[hsl(var(--nav-theme-light))] transition-colors" />
                </div>
                <p className="text-sm text-muted-foreground mb-4 flex-1">{link.description}</p>
                <span className="inline-flex items-center gap-2 self-start px-4 py-2 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm font-medium group-hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors">
                  {link.label}
                  <ArrowRight className="w-4 h-4" />
                </span>
              </a>
            ))}
          </div>

          {/* Update Tracker */}
          <div className="scroll-reveal">
            <h3 className="flex items-center gap-2 text-lg md:text-xl font-bold mb-4">
              <ScrollText className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              Update Tracker
            </h3>
            <div className="relative pl-6 border-l-2 border-[hsl(var(--nav-theme)/0.3)] space-y-6">
              {t.modules.animeDestinyOfficialLinks.updates.map((entry: any, index: number) => (
                <div key={index} className="relative">
                  <div className="absolute -left-[1.4rem] w-4 h-4 rounded-full bg-[hsl(var(--nav-theme))] border-2 border-background" />
                  <div className="p-5 bg-white/5 border border-border rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                        <Clock className="w-3 h-3" />
                        {entry.type}
                      </span>
                    </div>
                    <h4 className="font-bold mb-1">{entry.title}</h4>
                    <p className="text-sm text-muted-foreground">{entry.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://discord.com/invite/animedestiny"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.roblox.com/games/82674355647259/Anime-Destiny"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.robloxGame}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.roblox.com/communities/859372599/Anime-Destiny-AD"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.robloxCommunity}
                  </a>
                </li>
                <li>
                  <a
                    href="https://trello.com/b/vyRQHU11/anime-destiny-trello"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.trello}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
