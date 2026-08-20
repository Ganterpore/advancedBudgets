// Generates the PWA icon set (base + one per theme) from a single parameterized SVG design.
// Run with: npx tsx src/devops/generateIcons.ts
import { Resvg } from '@resvg/resvg-js'
import { mkdirSync, writeFileSync } from 'node:fs'
import { themes, type Theme } from '../lib/types/userTypes'

const SIZES: { name: string; size: number }[] = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'icon-maskable-512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 }
]

// Reuses the app's own semantic color roles rather than inventing new ones, so any theme added
// to userTypes.ts automatically gets a matching icon: background is the canvas, primary/secondary
// form the wallet, and text/secondary-text (the app's own readable-pair convention) form the coin.
function walletSvg (theme: Theme): string {
  return `
<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="512" height="512" fill="${theme.background}"/>
  <rect x="96" y="156" width="320" height="228" rx="34" fill="${theme.primary}"/>
  <path d="M96 190 a34 34 0 0 1 34 -34 h252 a34 34 0 0 1 34 34 v40 h-320 z" fill="${theme.secondary}"/>
  <line x1="96" y1="245" x2="416" y2="245" stroke="${theme.tertiary}" stroke-width="4" stroke-dasharray="10 8" opacity="0.4"/>
  <circle cx="330" cy="270" r="56" fill="${theme.text}"/>
  <text x="330" y="292" font-family="Arial, 'Helvetica Neue', sans-serif" font-size="60" font-weight="700"
        text-anchor="middle" fill="${theme['secondary-text']}">$</text>
</svg>`.trim()
}

function render (svg: string, size: number, outPath: string) {
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: size } })
  writeFileSync(outPath, resvg.render().asPng())
}

const staticDir = new URL('../../static', import.meta.url).pathname

// The static browser-tab favicon always uses the default theme (see PwaUpdatePrompt/app.html —
// intentionally not per-user, since favicons are fetched outside the page and cache unreliably).
render(walletSvg(themes.default), 128, `${staticDir}/favicon.png`)

// Every theme gets its own icon set under icons/<theme>/, which
// src/routes/manifest.webmanifest/+server.ts and +layout.svelte's apple-touch-icon pick between
// based on the logged-in user's saved theme.
for (const themeName of Object.keys(themes)) {
  const dir = `${staticDir}/icons/${themeName}`
  mkdirSync(dir, { recursive: true })
  for (const { name, size } of SIZES) {
    render(walletSvg(themes[themeName]), size, `${dir}/${name}`)
  }
}

console.log(`Generated icons for: ${Object.keys(themes).join(', ')}`)
