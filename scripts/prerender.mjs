import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
try {
  const { render, renderSeoHead, getSeo, seoPaths, siteUrl } = await server.ssrLoadModule('/src/entry-server.tsx')
  const template = await readFile('dist/index.html', 'utf8')
  const manifest = JSON.parse(await readFile('dist/.vite/manifest.json', 'utf8'))
  const assets = Object.entries(manifest).filter(([, value]) => value.src && value.file)
  const resolveAssets = html => assets.reduce((result, [source, value]) => result.replaceAll(`/${source}`, `/${value.file}`), html)
  for (const path of seoPaths) {
    const seo = getSeo(path)
    const html = template.replace('<html lang="az">', `<html lang="${seo.locale}">`)
      .replace(/<title data-seo>.*?<\/title>/, renderSeoHead(path))
      .replace('<div id="root"></div>', `<div id="root">${render(path)}</div>`)
    const directory = `dist${path === '/' ? '' : path}`
    await mkdir(directory, { recursive: true })
    await writeFile(`${directory}/index.html`, resolveAssets(html))
  }
  const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' + seoPaths.map(path => {
    const seo = getSeo(path)
    return `  <url><loc>${seo.url}</loc>${seo.alternates.map(alternate => `<xhtml:link rel="alternate" hreflang="${alternate.language}" href="${alternate.url}" />`).join('')}</url>`
  }).join('\n') + '\n</urlset>\n'
  await writeFile('dist/sitemap.xml', sitemap)
  await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`)
  console.log(`Statik HTML və SEO yaradıldı: ${seoPaths.length} səhifə, sitemap.xml, robots.txt`)
} finally {
  await server.close()
}
