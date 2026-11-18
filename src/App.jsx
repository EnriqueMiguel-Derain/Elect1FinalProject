import { useEffect, useMemo, useState } from 'react'
import legacyHTML from '../legacy-site.html?raw'

const PAGE_IDS = ['home', 'catalog', 'cart', 'inventory', 'pc-builder', 'circuit-builder', 'account', 'settings']

function readSiteTemplate() {
  const source = new DOMParser().parseFromString(legacyHTML, 'text/html')
  const main = source.querySelector('main')
  const sections = PAGE_IDS.map((name) => source.getElementById(`page-${name}`)).filter(Boolean)
  const pages = Object.fromEntries(sections.map((section) => [section.id.slice('page-'.length), {
    id: section.id,
    className: section.className,
    html: section.innerHTML,
  }]))
  const frame = [...source.body.children]
    .filter((node) => node !== main && node.tagName !== 'SCRIPT')
    .map((node) => node.outerHTML)
    .join('\n')
  return { pages, frame }
}

const site = readSiteTemplate()

function SitePage({ page, active }) {
  return <section
    id={page.id}
    className={page.className}
    hidden={!active}
    dangerouslySetInnerHTML={{ __html: page.html }}
  />
}

export default function App() {
  const [activePage, setActivePage] = useState(() => location.hash.slice(1) || 'home')
  const pages = useMemo(() => Object.entries(site.pages), [])

  useEffect(() => {
    const syncRoute = () => {
      const requested = location.hash.slice(1) || 'home'
      setActivePage(site.pages[requested] ? requested : 'home')
    }
    window.addEventListener('hashchange', syncRoute)
    syncRoute()
    return () => window.removeEventListener('hashchange', syncRoute)
  }, [])

  useEffect(() => {
    let active = true
    async function initializeFeatureModules() {
      await import('../js/supabase-config.js')
      if (active) await import('../js/main.js')
    }
    initializeFeatureModules().catch((error) => {
      console.error('Pyesa feature modules could not be initialized:', error)
    })
    return () => { active = false }
  }, [])

  return <div className="min-h-screen bg-[#08090f] text-slate-100">
    <div dangerouslySetInnerHTML={{ __html: site.frame }} />
    <main id="main" tabIndex="-1">
      {pages.map(([name, page]) => <SitePage key={name} page={page} active={name === activePage} />)}
    </main>
  </div>
}
