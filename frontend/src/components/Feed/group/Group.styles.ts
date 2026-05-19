import React from 'react'

// NOTE: hover/media effects omitted — use onMouseEnter/onMouseLeave
// NOTE: compound selectors (.FindGroupContainer h2, .tHead th, .tBody tr, .tBody td) and @media queries omitted

export const findGroupContainer: React.CSSProperties = {
  maxWidth: '900px',
  margin: '50px auto',
  padding: '25px',
  backgroundColor: '#f9f9f9',
  borderRadius: '15px',
  boxShadow: '0 8px 15px rgba(0, 0, 0, 0.2)',
  textAlign: 'center',
}

export const searchBarContainer: React.CSSProperties = {
  marginBottom: '20px',
}

export const searchInput: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  fontSize: '16px',
  borderRadius: '5px',
  border: '1px solid #ccc',
}

export const table: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  borderSpacing: 0,
  marginTop: '20px',
  backgroundColor: 'white',
  borderRadius: '10px',
  overflow: 'hidden',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
}

export const tHead: React.CSSProperties = {
  backgroundColor: '#c093fc',
  color: 'white',
}

export const tBody: React.CSSProperties = {}

export const joinLeaveButton: React.CSSProperties = {
  backgroundColor: '#c093fc',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  width: '120px',
  fontSize: '1rem',
  fontWeight: '500',
  borderRadius: '25px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease, transform 0.2s ease',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}
