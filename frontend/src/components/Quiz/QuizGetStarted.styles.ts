import React from 'react'
import quizGif from '@assets/quiz_gif.gif'

// NOTE: hover/media effects omitted — use onMouseEnter/onMouseLeave

export const quizGetStartedContainer: React.CSSProperties = {
  backgroundImage: `url(${quizGif})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  color: 'black',
  position: 'relative',
  overflow: 'hidden',
}

export const backgroundImage: React.CSSProperties = {
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  zIndex: -1,
}

export const nextButton: React.CSSProperties = {
  border: 'none',
  padding: '0.75rem 1.5rem',
  fontSize: '1.25rem',
  borderRadius: '50px',
  backgroundColor: '#c093fc',
  color: 'white',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
}
