import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getSeo, renderSeoHead } from '../seo'

export default function SEOHead() {
  const { pathname } = useLocation()
  useEffect(() => {
    document.documentElement.lang = getSeo(pathname).locale
    document.head.querySelectorAll('[data-seo]').forEach(element => element.remove())
    document.head.insertAdjacentHTML('beforeend', renderSeoHead(pathname))
  }, [pathname])
  return null
}
