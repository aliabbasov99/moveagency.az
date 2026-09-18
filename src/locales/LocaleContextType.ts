import { createContext } from 'react'
import type { Locale } from './index'
import { getDictForLocale } from './dict'

export interface LocaleContextType {
  locale: Locale
  dict: ReturnType<typeof getDictForLocale>
  setLocale: (locale: Locale) => void
  getLocalizedPath: (path: string) => string
}

export const LocaleContext = createContext<LocaleContextType | undefined>(undefined)
