import React from 'react'
import sporeGif from '@assets/spore.gif'
import manasthaliLogo from '@assets/Manasthali.png'

// NOTE: hover/media effects omitted — use onMouseEnter/onMouseLeave

export const signinContainer: React.CSSProperties = {
  backgroundImage: `url(${sporeGif})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingRight: '50px',
}

export const signinBox: React.CSSProperties = {
  backgroundColor: 'transparent',
  padding: '10px',
  borderRadius: '20px',
  boxShadow: '0px 1px 2px 1px rgba(0, 0, 0, 0.3)',
  backdropFilter: 'blur(10px)',
  textAlign: 'center',
  width: '500px',
  maxWidth: '1000px',
  position: 'relative',
  right: '0',
}

export const signinLogo: React.CSSProperties = {
  width: '100px',
  height: '100px',
  backgroundImage: `url(${manasthaliLogo})`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'contain',
  margin: '10px auto 20px',
}

export const inputContainer: React.CSSProperties = {
  width: '100%',
  marginTop: '20px',
  marginBottom: '20px',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
}

export const inputField: React.CSSProperties = {
  width: '445px',
  height: 'auto',
  backgroundColor: 'transparent',
  borderBottom: '1px solid black',
  fontSize: '1rem',
}

export const labelField: React.CSSProperties = {
  height: '25px',
  marginLeft: '5px',
  fontSize: '1.2rem',
  color: 'black',
  textAlign: 'left',
}

export const passwordFieldContainer: React.CSSProperties = {
  position: 'relative',
  width: '100%',
}

export const togglePassword: React.CSSProperties = {
  position: 'absolute',
  right: '20px',
  top: '50%',
  transform: 'translateY(-50%)',
  fontSize: '14px',
  color: 'black',
  fontWeight: 'bold',
  cursor: 'pointer',
}

export const inBtn: React.CSSProperties = {
  color: 'black',
  backgroundColor: '#55aafe',
  fontWeight: 'bold',
  borderBottom: '1px solid black',
  width: '200px',
  height: '40px',
  margin: '20px',
  fontSize: '1rem',
}

export const inBtnOutline: React.CSSProperties = {
  color: 'black',
  backgroundColor: '#55aafe',
  fontWeight: 'bold',
  borderBottom: '1px solid black',
  width: '200px',
  height: '40px',
  margin: '20px',
  fontSize: '1rem',
}

export const inAnchor: React.CSSProperties = {
  fontSize: '17px',
  textDecoration: 'none',
  color: 'black',
  cursor: 'pointer',
  backgroundColor: 'transparent',
  border: 'none',
}

export const errorText: React.CSSProperties = {
  fontSize: '0.7rem',
  color: 'rgb(254, 73, 73)',
  textAlign: 'left',
  paddingLeft: '5px',
}

export const errorBorder: React.CSSProperties = {
  border: '1px solid rgb(254, 73, 73)',
}
