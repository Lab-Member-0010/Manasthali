import React from 'react'

// NOTE: hover/media effects omitted — use onMouseEnter/onMouseLeave
// NOTE: @keyframes (animate, fallIn) omitted — apply via CSS animation string or a separate global stylesheet

export const mainContainer: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  overflow: 'hidden',
}

export const contentContainer: React.CSSProperties = {
  display: 'flex',
  flex: 1,
  width: '100%',
  marginTop: '18px',
}

export const leftNavbar: React.CSSProperties = {
  width: '180px',
  borderRight: '1px solid lightgrey',
  backgroundColor: 'white',
}

export const navItem: React.CSSProperties = {
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

export const rightNavbar: React.CSSProperties = {
  width: '100px',
  height: '100%',
  backgroundColor: 'white',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'start',
  borderLeft: '1px solid lightgray',
  overflowY: 'auto',
}

export const navItems: React.CSSProperties = {
  padding: '15px',
  cursor: 'pointer',
  border: '0px',
  borderRadius: '50%',
  textAlign: 'center',
}

export const midPart: React.CSSProperties = {
  backgroundColor: 'white',
  flex: 1,
  color: 'white',
  fontSize: '24px',
  overflowY: 'auto',
  overflowX: 'hidden',
  paddingLeft: '70px',
  paddingRight: '70px',
}

export const innerDb: React.CSSProperties = {
  backgroundColor: 'white',
  height: 'calc(100vh - 100px)',
  overflowY: 'scroll',
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  marginBottom: '20px',
}

export const storiesDiv: React.CSSProperties = {
  backgroundColor: 'white',
  color: 'black',
  height: '80px',
  maxHeight: '500px',
  overflowY: 'auto',
  msOverflowStyle: 'none',
  borderBottom: '1px solid lightgray',
}

export const header: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 20px',
  backgroundColor: 'white',
  borderBottom: '0px solid #ddd',
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
}

export const headerLeft: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
}

export const menuButton: React.CSSProperties = {
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
}

export const rotatingLogo: React.CSSProperties = {
  animation: 'animate 5s infinite ease-in-out',
}

export const profileIcon: React.CSSProperties = {
  height: '30px',
  width: '30px',
  border: '1px solid black',
  borderRadius: '50%',
}

export const siteLogo: React.CSSProperties = {
  fontSize: '40px',
  fontWeight: 'bold',
  background: 'linear-gradient(45deg, #1a5a6d, #39a4bf, #25768a, #8d7fd2, #7c5fb5, #a06bba, #e584b5, #e0718e)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  color: 'transparent',
  display: 'inline',
  filter: 'brightness(1.2)',
  animation: 'fallIn 1.5s ease-in-out',
  position: 'relative',
}
