import React from 'react'

// NOTE: hover/media effects omitted — use onMouseEnter/onMouseLeave

export const challengeContainer: React.CSSProperties = {
  maxWidth: '900px',
  margin: '50px auto',
  padding: '25px',
  backgroundColor: '#f9f9f9',
  borderRadius: '15px',
  boxShadow: '0 8px 15px rgba(0, 0, 0, 0.2)',
  textAlign: 'center',
}

export const fetchChallengeButton: React.CSSProperties = {
  backgroundColor: '#c093fc',
  color: 'white',
  border: 'none',
  padding: '5px 20px',
  fontSize: '1rem',
  fontWeight: '500',
  borderRadius: '10px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease, transform 0.2s ease',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}

export const complete: React.CSSProperties = {
  backgroundColor: 'rgb(59, 228, 76)',
  color: 'white',
  border: 'none',
  padding: '5px 20px',
  width: '300px',
  fontSize: '1.3rem',
  fontWeight: '500',
  borderRadius: '10px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease, transform 0.2s ease',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}

export const incomplete: React.CSSProperties = {
  backgroundColor: 'rgb(238, 132, 132)',
  color: 'white',
  border: 'none',
  padding: '5px 20px',
  fontSize: '1.3rem',
  fontWeight: '500',
  width: '300px',
  borderRadius: '10px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease, transform 0.2s ease',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}
