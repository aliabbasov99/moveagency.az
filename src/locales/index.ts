export type Locale = 'az' | 'en' | 'ru'

export const locales = ['az', 'en', 'ru'] as const

export function getLocaleFromPathname(pathname: string): Locale {
  const match = pathname.match(/^\/(en|ru)(?:\/|$)/)
  if (match && match[1] === 'en') return 'en'
  if (match && match[1] === 'ru') return 'ru'
  return 'az'
}

export function getLocaleFromPath(): Locale {
  if (typeof window === 'undefined') return 'az'
  return getLocaleFromPathname(window.location.pathname)
}

export function getLocalizedPath(locale: Locale, path: string): string {
  const cleanPath = path.replace(/^\/(en|ru)(?:\/|$)/, '/').replace(/^\/+/, '/') || '/'
  if (locale === 'az') return cleanPath
  return `/${locale}${cleanPath === '/' ? '' : cleanPath}`
}

export function getLocaleFromRoute(route: string): Locale {
  return getLocaleFromPathname(route)
}
