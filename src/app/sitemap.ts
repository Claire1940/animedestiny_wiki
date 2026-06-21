import { MetadataRoute } from 'next'
import { getAllContent, CONTENT_TYPES, type ContentType } from '@/lib/content'
import { routing, type Locale } from '@/i18n/routing'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.animedestiny.wiki'

// 内容类型优先级配置（对齐 navigation.ts 实际 8 个类型）
const contentTypePriority: Record<string, number> = {
	'codes': 0.9,
	'guide': 0.9,
	'tier': 0.9,
	'review': 0.9,
	'summons': 0.8,
	'evolution': 0.8,
	'raids': 0.8,
	'roblox': 0.7,
}

// 内容更新频率配置（codes 兑换码频繁更新用 daily，roblox 基础信息用 monthly）
const contentTypeChangeFrequency: Record<string, 'daily' | 'weekly' | 'monthly'> = {
	'codes': 'daily',
	'guide': 'weekly',
	'tier': 'weekly',
	'review': 'weekly',
	'summons': 'weekly',
	'evolution': 'weekly',
	'raids': 'weekly',
	'roblox': 'monthly',
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const sitemap: MetadataRoute.Sitemap = []

	// 1. 首页（所有语言版本）
	for (const locale of routing.locales) {
		sitemap.push({
			url: locale === 'en' ? BASE_URL : `${BASE_URL}/${locale}`,
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 1.0,
		})
	}

	// 2. 内容分类页和所有 MDX 文章（所有语言版本和内容类型）
	for (const locale of routing.locales) {
		for (const contentType of CONTENT_TYPES) {
			try {
				const articles = await getAllContent(contentType as ContentType, locale as Locale, {
					includeFallback: false,
				})
				const priority = contentTypePriority[contentType] || 0.7
				const changeFrequency = contentTypeChangeFrequency[contentType] || 'weekly'

				if (articles.length > 1) {
					const listUrl =
						locale === 'en'
							? `${BASE_URL}/${contentType}`
							: `${BASE_URL}/${locale}/${contentType}`
					const latestArticle = articles[0]
					const latestDate = latestArticle.frontmatter.lastModified || latestArticle.frontmatter.date

					sitemap.push({
						url: listUrl,
						lastModified: latestDate ? new Date(latestDate) : new Date(),
						changeFrequency,
						priority: Math.min(priority + 0.05, 0.95),
					})
				}

				for (const article of articles) {
					const articleUrl =
						locale === 'en'
							? `${BASE_URL}/${contentType}/${article.slug}`
							: `${BASE_URL}/${locale}/${contentType}/${article.slug}`
					const articleDate = article.frontmatter.lastModified || article.frontmatter.date

					sitemap.push({
						url: articleUrl,
						lastModified: articleDate ? new Date(articleDate) : new Date(),
						changeFrequency,
						priority,
					})
				}
			} catch (error) {
				console.warn(`Failed to load content for ${locale}/${contentType}:`, error)
			}
		}
	}

	return sitemap
}
