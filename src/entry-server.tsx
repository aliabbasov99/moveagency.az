import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { AppRoutes } from './App'
export { getSeo, renderSeoHead, seoPaths, siteUrl } from './seo'

export function render(pathname: string) {
  return renderToString(<StaticRouter location={pathname}><AppRoutes /></StaticRouter>)
}
