import { getLocaleFromPathname, getLocalizedPath, locales } from './locales'
import { getDictForLocale } from './locales/dict'
import logo from './assets/img/static/ma_logo.webp'
import socialImage from './assets/img/static/smm.jpg'

export const siteUrl = 'https://www.moveagency.az'
export const pagePaths = ['/', '/mexfilik-siyaseti', '/istifade-sertleri'] as const
export const seoPaths = locales.flatMap(locale => pagePaths.map(path => getLocalizedPath(locale, path)))

const metadata = {
  az: [
    ['SMM Xidməti Bakı | Sosial Media Marketinq - Move Agency', 'Bakıda SMM xidməti: sosial media idarəetməsi, kontent strategiyası, video çəkiliş və reklam. SMM nədir (smm nedir)? Brendiniz üçün Move Agency ilə tanış olun.'],
    ['Məxfilik siyasəti | Move Agency Azərbaycan', 'Move Agency məxfilik siyasəti: sorğu və əlaqə məlumatlarının toplanması, istifadəsi, qorunması və xarici platformalar haqqında məlumatları bu səhifədə oxuyun.'],
    ['İstifadə şərtləri | Move Agency Azərbaycan', 'Move Agency saytından istifadə şərtləri: məzmun hüquqları, sorğu və əlaqə qaydaları, xidmət razılaşmaları və məsuliyyət barədə əsas məlumatlarla tanış olun.'],
  ],
  en: [
    ['SMM Services in Azerbaijan | Move Agency', 'SMM services in Azerbaijan with Move Agency: social media management, content strategy, video production and performance marketing tailored to your own brand.'],
    ['Privacy Policy | Move Agency Azerbaijan', 'Read the Move Agency privacy policy to learn how contact details and enquiries are collected, used and protected, and how links to external platforms work.'],
    ['Terms of Use | Move Agency Azerbaijan', 'Read the Move Agency terms of use covering website content, intellectual property, enquiries, service agreements, liability and updates to these conditions.'],
  ],
  ru: [
    ['SMM-услуги в Азербайджане | Move Agency', 'SMM-услуги в Азербайджане от Move Agency: ведение социальных сетей, контент-стратегия, видеосъёмка и реклама для вашего бренда. Познакомьтесь с агентством.'],
    ['Политика конфиденциальности | Move Agency', 'Политика конфиденциальности Move Agency: как собираются, используются и защищаются данные обращений, а также правила перехода на сторонние платформы сайта.'],
    ['Условия использования | Move Agency', 'Условия использования сайта Move Agency: права на материалы, порядок обращений, соглашения об услугах, ограничение ответственности и обновления этих правил.'],
  ],
} as const

export function getSeo(pathname: string) {
  const locale = getLocaleFromPathname(pathname)
  const basePath = getLocalizedPath('az', pathname).replace(/\/$/, '') || '/'
  const pageIndex = pagePaths.findIndex(path => path === basePath)
  const [title, description] = metadata[locale][pageIndex < 0 ? 0 : pageIndex]
  const path = getLocalizedPath(locale, basePath)
  const url = siteUrl + path
  const dict = getDictForLocale(locale)
  const organizationId = `${siteUrl}/#organization`
  const absolute = (asset: string) => new URL(asset, siteUrl).href
  const graph: Record<string, unknown>[] = [
    { '@type': 'Organization', '@id': organizationId, name: 'Move Agency', url: siteUrl,
      logo: absolute(logo), email: 'moveagencyy@gmail.com', telephone: '+994559242562',
      sameAs: ['https://www.instagram.com/moveagency.az', 'https://www.youtube.com/@MoveAgencyy'],
      contactPoint: { '@type': 'ContactPoint', telephone: '+994559242562', contactType: 'customer service', availableLanguage: ['Azerbaijani', 'English', 'Russian'], areaServed: 'AZ' } },
    { '@type': 'WebSite', '@id': `${siteUrl}/#website`, url: siteUrl, name: 'Move Agency', publisher: { '@id': organizationId }, inLanguage: [...locales] },
    { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: title, description, inLanguage: locale, isPartOf: { '@id': `${siteUrl}/#website` }, about: { '@id': organizationId } },
  ]
  if (pageIndex === 0) {
    for (const key of ['smm', 'contentStrategy', 'production', 'performanceMarketing'] as const) {
      const service = dict.services[key]
      graph.push({ '@type': 'Service', '@id': `${url}#service-${key}`, name: service.title, description: service.desc,
        serviceType: service.title, url: `${url}#services`, provider: { '@id': organizationId }, areaServed: { '@type': 'Country', name: 'Azerbaijan' } })
    }
  } else if (pageIndex > 0) {
    graph.push({ '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: [
      { '@type': 'ListItem', position: 1, name: dict.navbar.home, item: siteUrl + getLocalizedPath(locale, '/') },
      { '@type': 'ListItem', position: 2, name: pageIndex === 1 ? dict.legal.privacy.title : dict.legal.terms.title, item: url },
    ] })
  }
  return { locale, title, description, url, known: pageIndex >= 0, image: absolute(socialImage),
    imageAlt: dict.heroSection.imageAlt, ogLocale: { az: 'az_AZ', en: 'en_US', ru: 'ru_RU' }[locale],
    alternates: [...locales.map(language => ({ language, url: siteUrl + getLocalizedPath(language, basePath) })), { language: 'x-default', url: siteUrl + basePath }],
    schema: { '@context': 'https://schema.org', '@graph': graph } }
}

export function renderSeoHead(pathname: string) {
  const seo = getSeo(pathname)
  const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const meta = (name: string, content: string, property = false) => `<meta data-seo ${property ? 'property' : 'name'}="${name}" content="${escape(content)}" />`
  return [
    `<title data-seo>${escape(seo.title)}</title>`,
    meta('description', seo.description),
    meta('robots', seo.known ? 'index, follow, max-image-preview:large' : 'noindex, follow'),
    `<link data-seo rel="canonical" href="${escape(seo.url)}" />`,
    ...seo.alternates.map(alternate => `<link data-seo rel="alternate" hreflang="${alternate.language}" href="${escape(alternate.url)}" />`),
    meta('og:type', 'website', true), meta('og:site_name', 'Move Agency', true),
    meta('og:title', seo.title, true), meta('og:description', seo.description, true), meta('og:url', seo.url, true),
    meta('og:locale', seo.ogLocale, true),
    ...['az_AZ', 'en_US', 'ru_RU'].filter(locale => locale !== seo.ogLocale).map(locale => meta('og:locale:alternate', locale, true)),
    meta('og:image', seo.image, true), meta('og:image:alt', seo.imageAlt, true),
    meta('twitter:card', 'summary_large_image'), meta('twitter:title', seo.title),
    meta('twitter:description', seo.description), meta('twitter:image', seo.image), meta('twitter:image:alt', seo.imageAlt),
    `<script data-seo type="application/ld+json">${JSON.stringify(seo.schema).replace(/</g, '\\u003c')}</script>`,
  ].join('\n    ')
}
