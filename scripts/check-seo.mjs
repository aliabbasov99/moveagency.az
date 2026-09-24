import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
try {
  const { getSeo, seoPaths } = await server.ssrLoadModule('/src/seo.ts')
  const { dict } = await server.ssrLoadModule('/src/locales/dict.ts')
  const { getLocalizedPath, getLocaleFromPathname } = await server.ssrLoadModule('/src/locales/index.ts')
  const sitemap = await readFile('dist/sitemap.xml', 'utf8')
  const robots = await readFile('dist/robots.txt', 'utf8')
  const titles = new Set()
  const descriptions = new Set()
  const problems = []
  for (const path of seoPaths) {
    const seo = getSeo(path)
    const html = await readFile(`dist${path === '/' ? '' : path}/index.html`, 'utf8')
    if (process.env.SEO_BASE_URL) {
      const response = await fetch(new URL(path, process.env.SEO_BASE_URL))
      assert.equal(response.status, 200, `${path}: HTTP status`)
      assert.equal(await response.text(), html, `${path}: server yanlış HTML qaytarır`)
    }
    const head = html.match(/<head>([\s\S]*?)<\/head>/)[1]
    const body = html.match(/<body>([\s\S]*?)<\/body>/)[1]
    const title = head.match(/<title[^>]*>(.*?)<\/title>/)[1]
    const description = head.match(/name="description" content="([^"]*)"/)[1]
    assert.ok(title.length < 60, `${path}: title`)
    if (seo.description.length < 155 || seo.description.length > 160) problems.push(`${path}: description ${seo.description.length}`)
    assert.equal((head.match(/<title/g) || []).length, 1)
    assert.equal((head.match(/name="description"/g) || []).length, 1)
    assert.ok(!titles.has(title), `${path}: təkrarlanan title`)
    assert.ok(!descriptions.has(description), `${path}: təkrarlanan description`)
    titles.add(title)
    descriptions.add(description)
    assert.ok(html.includes(`<html lang="${seo.locale}">`))
    assert.ok(head.includes(`rel="canonical" href="${seo.url}"`))
    for (const alternate of seo.alternates) assert.ok(head.includes(`hreflang="${alternate.language}" href="${alternate.url}"`))
    assert.ok(head.includes('href="/favicon.svg"'))
    assert.ok(head.includes('name="twitter:card" content="summary_large_image"'))
    assert.ok(head.includes('property="og:locale"'))
    const schema = JSON.parse(head.match(/type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])
    assert.ok(schema['@graph'].some(item => item['@type'] === 'Organization'))
    assert.ok(!schema['@graph'].some(item => ['FAQPage', 'Product', 'LocalBusiness'].includes(item['@type'])))
    assert.ok(sitemap.includes(`<loc>${seo.url}</loc>`))
    const text = body.replace(/<[^>]*>/g, '').replace(/&(?:#x27|apos);/g, "'").replace(/&amp;/g, '&').replace(/\s+/g, ' ')
    assert.ok(text.includes(dict[seo.locale].form.title) || text.includes(dict[seo.locale].legal.privacy.title) || text.includes(dict[seo.locale].legal.terms.title))
    if (path.includes('mexfilik')) assert.ok(text.includes(dict[seo.locale].legal.privacyContent.intro))
    if (path.includes('istifade')) assert.ok(text.includes(dict[seo.locale].legal.termsContent.intro))
    if (seo.locale !== 'az') assert.ok(!/[əƏıİğĞşŞçÇ]/.test(text), `${path}: tərcümə edilməyən AZ mətni`)
    for (const match of html.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)[^"]*"/g)) await access(`dist${match[1]}`)
    assert.ok(!html.includes('/src/assets/'), `${path}: build olunmamış şəkil yolu`)
    for (const match of html.matchAll(/<img\b[^>]*>/g)) assert.ok(/\balt=/.test(match[0]), `${path}: alt yoxdur`)
    console.log(`${path}: title=${seo.title.length}, description=${seo.description.length}; HTML, dil, schema və resurslar yoxlanıldı`)
  }
  assert.equal((sitemap.match(/<url>/g) || []).length, seoPaths.length)
  assert.ok(robots.includes('Sitemap: https://www.moveagency.az/sitemap.xml'))
  assert.equal(await readFile('dist/favicon.svg', 'utf8'), await readFile('public/favicon.svg', 'utf8'))
  assert.equal(getLocalizedPath('ru', '/en/mexfilik-siyaseti'), '/ru/mexfilik-siyaseti')
  assert.equal(getLocalizedPath('az', '/ru'), '/')
  assert.equal(getLocaleFromPathname('/english'), 'az')
  assert.equal(getLocalizedPath('en', '/'), '/en')
  assert.deepEqual(problems, [], 'Meta description uzunluqları')
  console.log(`SEO yoxlaması keçdi: ${seoPaths.length} səhifə`)
} finally {
  await server.close()
}
