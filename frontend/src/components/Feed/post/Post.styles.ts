import React from 'react'

// NOTE: hover/media effects omitted — use onMouseEnter/onMouseLeave

export const container: React.CSSProperties = {
  padding: '20px',
}

export const createPost: React.CSSProperties = {
  border: 'none',
  padding: '0.5rem 1.5rem',
  fontSize: '1.25rem',
  borderRadius: '10px',
  backgroundColor: '#c093fc',
  color: 'white',
  transition: 'transform 0.3s ease, background-color 0.3s ease',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
}
