'use client'
import { useEffect, useState } from 'react'
import { Copy, Check } from 'lucide-react'

// Attaches a floating copy button to every rehype-pretty-code figure block.
// Runs entirely in the client after MDX is rendered — no changes to mdx-components.
// Render this anywhere inside the post page; it returns null visually.
export default function CopyButton() {
  useEffect(() => {
    const figures = document.querySelectorAll<HTMLElement>(
      'figure[data-rehype-pretty-code-figure]'
    )

    const cleanups: (() => void)[] = []

    figures.forEach(figure => {
      // Avoid double-injecting on fast navigation
      if (figure.querySelector('.copy-btn')) return

      const pre  = figure.querySelector('pre')
      const code = figure.querySelector('code')
      if (!pre || !code) return

      // Position the figure relatively so the button can be absolute inside it
      figure.style.position = 'relative'

      const btn = document.createElement('button')
      btn.className = 'copy-btn'
      btn.setAttribute('aria-label', 'Copy code')
      btn.innerHTML = copyIcon()

      // Style the button
      Object.assign(btn.style, {
        position:        'absolute',
        top:             '10px',
        right:           '10px',
        padding:         '5px',
        borderRadius:    '6px',
        border:          '1px solid rgba(255,255,255,0.08)',
        background:      'rgba(255,255,255,0.05)',
        cursor:          'pointer',
        color:           '#94a3b8',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        transition:      'all 0.15s',
        opacity:         '0',
        zIndex:          '10',
      })

      // Show on figure hover
      const showBtn = () => { btn.style.opacity = '1' }
      const hideBtn = () => { btn.style.opacity = '0' }
      figure.addEventListener('mouseenter', showBtn)
      figure.addEventListener('mouseleave', hideBtn)

      btn.addEventListener('mouseenter', () => {
        btn.style.background = 'rgba(16,185,129,0.15)'
        btn.style.borderColor = 'rgba(16,185,129,0.3)'
        btn.style.color = '#34d399'
      })
      btn.addEventListener('mouseleave', () => {
        btn.style.background = 'rgba(255,255,255,0.05)'
        btn.style.borderColor = 'rgba(255,255,255,0.08)'
        btn.style.color = '#94a3b8'
      })

      btn.addEventListener('click', async () => {
        const text = code.textContent ?? ''
        try {
          await navigator.clipboard.writeText(text)
          btn.innerHTML = checkIcon()
          btn.style.color = '#10b981'
          setTimeout(() => {
            btn.innerHTML = copyIcon()
            btn.style.color = '#94a3b8'
          }, 1800)
        } catch {
          // Clipboard API unavailable — silently ignore
        }
      })

      figure.appendChild(btn)

      cleanups.push(() => {
        figure.removeEventListener('mouseenter', showBtn)
        figure.removeEventListener('mouseleave', hideBtn)
        btn.remove()
      })
    })

    return () => cleanups.forEach(fn => fn())
  }, [])

  return null
}

function copyIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
  </svg>`
}

function checkIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20 6 9 17l-5-5"/>
  </svg>`
}
