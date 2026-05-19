import React from 'react'

// NOTE: hover/media effects omitted — use onMouseEnter/onMouseLeave
// NOTE: @keyframes animate and @keyframes fallIn are omitted — apply animation via inline style or a CSS file

export const adminContainer: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  overflow: 'hidden',
}

export const headerAdmin: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 20px',
  backgroundColor: 'white',
  borderBottom: '0px solid #ddd',
  position: 'fixed',
  top: '0',
  left: '0',
  right: '0',
  zIndex: 1000,
}

export const headerLeftAdmin: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
}

export const rotatingLogoAdmin: React.CSSProperties = {
  // animation: 'animate 5s infinite ease-in-out' — apply via className or keyframes in CSS
}

export const siteLogoAdmin: React.CSSProperties = {
  fontSize: '40px',
  fontWeight: 'bold',
  background: 'linear-gradient(45deg, #1a5a6d, #39a4bf, #25768a, #8d7fd2, #7c5fb5, #a06bba, #e584b5, #e0718e)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  color: 'transparent',
  display: 'inline',
  filter: 'brightness(1.2)',
  position: 'relative',
}

export const contentContainerAdmin: React.CSSProperties = {
  display: 'flex',
  flex: 1,
  width: '100%',
  marginTop: '18px',
}

export const leftNavbarAdmin: React.CSSProperties = {
  width: '180px',
  borderRight: '1px solid lightgrey',
  backgroundColor: 'white',
}

export const navItemAdmin: React.CSSProperties = {
  border: '0px solid black',
  borderRadius: '2px',
  width: '170px',
  height: '45px',
  margin: '5px',
  padding: '0px',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  paddingLeft: '15px',
}

export const midPartAdmin: React.CSSProperties = {
  backgroundColor: 'white',
  flex: 1,
  color: 'white',
  fontSize: '24px',
  overflowY: 'auto',
  overflowX: 'hidden',
  paddingLeft: '70px',
  paddingRight: '70px',
}

export const innerDbAdmin: React.CSSProperties = {
  backgroundColor: 'white',
  height: 'calc(100vh - 100px)',
  overflowY: 'scroll',
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  marginBottom: '20px',
}
