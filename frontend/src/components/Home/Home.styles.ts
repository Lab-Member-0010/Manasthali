import React from 'react'
import sporeGif from '@assets/spore.gif'

// NOTE: hover/media effects omitted — use onMouseEnter/onMouseLeave

export const backgroundContainer: React.CSSProperties = {
  backgroundImage: `url(${sporeGif})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  paddingRight: '50px',
}

export const adminLoginToggle: React.CSSProperties = {
  width: '60px',
  height: '60px',
  position: 'absolute',
  bottom: '20px',
  right: '20px',
}

export const homeContainer: React.CSSProperties = {
  backgroundColor: 'transparent',
  padding: '50px',
  borderRadius: '20px',
  boxShadow: '0px 1px 2px 1px rgba(0, 0, 0, 0.3)',
  backdropFilter: 'blur(10px)',
  textAlign: 'center',
  maxWidth: '1000px',
  position: 'relative',
  right: '0',
}

export const customBtn: React.CSSProperties = {
  color: 'black',
  backgroundColor: 'transparent',
  fontWeight: 'bold',
  padding: '14px 24px',
  fontSize: '1.1rem',
  boxShadow: '0px 1px 0px 1px rgba(0, 0, 0, 0.2)',
}

export const customBtnOutline: React.CSSProperties = {
  color: 'black',
  backgroundColor: 'transparent',
  fontWeight: 'bold',
  padding: '14px 24px',
  fontSize: '1.1rem',
  boxShadow: '0px 1px 0px 1px rgba(0, 0, 0, 0.2)',
}

export const modalAbout: React.CSSProperties = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'rgb(251, 248, 248)',
  borderRadius: '10px',
  zIndex: 9999,
  height: '50%',
  width: '50%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
}

export const modalAboutOverlay: React.CSSProperties = {
  position: 'fixed',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  background: 'rgba(0, 0, 0, 0.5)',
  zIndex: 9998,
}

export const closeButton: React.CSSProperties = {
  background: 'none',
  width: '20px',
  height: '20px',
  border: '1px solid gray',
  borderRadius: '50%',
  fontWeight: 'bold',
  fontSize: '10px',
  color: 'lightgray',
  backgroundColor: 'white',
}
