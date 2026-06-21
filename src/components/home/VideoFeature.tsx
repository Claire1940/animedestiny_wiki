"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, Play } from "lucide-react";

interface VideoFeatureProps {
  videoId: string;
  title: string;
}

/**
 * 视频区域：进入视口自动播放（静音 + 循环），并保留点击播放按钮作为后备。
 *
 * - IntersectionObserver 监测容器进入视口 → 加载带 autoplay=1&mute=1&loop=1 的 iframe
 * - 用户在自动触发前点击播放按钮 → 同样加载并播放（后备交互）
 * - 未激活时展示 YouTube 缩略图 + 播放按钮，避免首屏即拉起 iframe
 */
export function VideoFeature({ videoId, title }: VideoFeatureProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);

  const watchUrl = useMemo(
    () => `https://www.youtube.com/watch?v=${videoId}`,
    [videoId],
  );

  // 自动播放嵌入地址：静音 + 循环（单视频循环需同时传 playlist=videoId）
  const embedUrl = useMemo(
    () =>
      `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&playsinline=1&rel=0`,
    [videoId],
  );

  const thumbnailUrl = useMemo(
    () => `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    [videoId],
  );

  // 进入视口自动加载并播放
  useEffect(() => {
    if (active) return;
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [active]);

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-lg bg-black"
        style={{ paddingBottom: "56.25%" }}
      >
        {active ? (
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setActive(true)}
            aria-label={`Play video: ${title}`}
            className="group absolute top-0 left-0 flex h-full w-full items-center justify-center"
          >
            {/* 缩略图 */}
            <img
              src={thumbnailUrl}
              alt={title}
              loading="lazy"
              className="absolute top-0 left-0 h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
            />
            {/* 遮罩 */}
            <span
              className="absolute top-0 left-0 h-full w-full bg-black/40"
              aria-hidden="true"
            />
            {/* 播放按钮 */}
            <span
              className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--nav-theme))] text-white shadow-lg transition-transform group-hover:scale-110"
              aria-hidden="true"
            >
              <Play className="h-7 w-7 translate-x-0.5 fill-current" />
            </span>
          </button>
        )}
      </div>

      <div className="flex justify-center">
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
        >
          Watch on YouTube
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
