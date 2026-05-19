import React from 'react'

// NOTE: compound selectors (.circle.activeStory, .storyViewer img) and hover effects omitted

export const circle: React.CSSProperties = {
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  backgroundColor: '#3498db',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
}

export const activeStory: React.CSSProperties = {
  borderColor: 'red',
}

export const profileImage: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: '50%',
}

export const storyViewer: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0, 0, 0, 0.9)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 999,
}
