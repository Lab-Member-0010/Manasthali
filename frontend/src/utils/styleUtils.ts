import { useState, useCallback } from 'react'

/**
 * useHover — returns style-prop handlers + a merged style object.
 *
 * Usage:
 *   const { hoverProps, isHovered } = useHover()
 *   <button {...hoverProps} style={isHovered ? {...base, ...hoverStyle} : base}>
 */
export function useHover() {
  const [isHovered, setIsHovered] = useState(false)

  const hoverProps = {
    onMouseEnter: useCallback(() => setIsHovered(true), []),
    onMouseLeave: useCallback(() => setIsHovered(false), []),
  }

  return { isHovered, hoverProps }
}

/**
 * mergeStyles — spreads multiple CSSProperties objects together.
 * Falsy entries are safely ignored.
 *
 * Usage:
 *   style={mergeStyles(styles.base, isActive && styles.active)}
 */
export function mergeStyles(
  ...args: (React.CSSProperties | false | null | undefined)[]
): React.CSSProperties {
  return Object.assign({}, ...args.filter(Boolean))
}

/**
 * injectGlobalStyles — injects a CSS string into a <style> tag in <head>.
 * Call once from main.tsx for global resets and @keyframes.
 */
export function injectGlobalStyles(css: string): void {
  if (typeof document === 'undefined') return
  const existing = document.getElementById('manasthali-global-styles')
  if (existing) return // already injected
  const style = document.createElement('style')
  style.id = 'manasthali-global-styles'
  style.textContent = css
  document.head.appendChild(style)
}
