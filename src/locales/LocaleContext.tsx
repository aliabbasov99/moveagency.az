import { useMemo } from 'react'
import type { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { Locale } from './index'
import { getLocaleFromPathname, getLocalizedPath as getLocalizedPathUtil } from './index'
import { getDictForLocale } from './dict'
import { LocaleContext } from './LocaleContextType'

export function LocaleProvider({ children }: { children: ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  
  const locale = useMemo(() => getLocaleFromPathname(location.pathname), [location.pathname])

  const setLocale = (newLocale: Locale) => {
    const currentPathname = location.pathname
    const cleanPath = currentPathname.replace(/^\/(en|ru)(?:\/|$)/, '/') || '/'
    const newPath = newLocale === 'az' ? cleanPath : `/${newLocale}${cleanPath === '/' ? '' : cleanPath}`
    navigate(newPath + location.search + location.hash)
  }

  const dict = getDictForLocale(locale)

  const getLocalizedPath = (path: string) => {
    return getLocalizedPathUtil(locale, path)
  }

  return (
    <LocaleContext.Provider value={{ locale, dict, setLocale, getLocalizedPath }}>
      {children}
    </LocaleContext.Provider>
  )
}
