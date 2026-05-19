import React from 'react'

// NOTE: hover/media effects omitted — use onMouseEnter/onMouseLeave

export const container: React.CSSProperties = {
  marginBottom: '80px',
  padding: '20px',
}

export const cardsContainer: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '20px',
  padding: '20px',
  margin: '0px auto',
  maxWidth: '1200px',
}

export const card: React.CSSProperties = {
  backgroundColor: '#f9f9f9',
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  padding: '20px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
}

export const personalityImage: React.CSSProperties = {
  height: '100px',
  width: '120px',
}
