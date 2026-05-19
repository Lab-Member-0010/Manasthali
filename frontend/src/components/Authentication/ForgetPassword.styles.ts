import React from 'react'

// NOTE: hover/media effects omitted — use onMouseEnter/onMouseLeave

export const forgetContainer: React.CSSProperties = {
  backgroundImage: "url('../../images/spore.gif')",
  backgroundSize: 'cover',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

export const forgetBox: React.CSSProperties = {
  width: '400px',
  height: '400px',
  maxWidth: '400px',
  padding: '20px',
  borderRadius: '10px',
  backgroundColor: 'transparent',
  boxShadow: '0px 1px 2px 1px rgba(0, 0, 0, 0.3)',
  backdropFilter: 'blur(10px)',
}

export const forgetLogo: React.CSSProperties = {
  width: '100px',
  height: '100px',
  backgroundImage: "url('../../images/Manasthali.png')",
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
  width: '350px',
  height: 'auto',
  backgroundColor: 'transparent',
  borderBottom: '1px solid black',
  fontSize: '1rem',
}

export const forgetButton: React.CSSProperties = {
  color: 'black',
  backgroundColor: '#55aafe',
  fontWeight: 'bold',
  borderBottom: '1px solid black',
  width: '310px',
  height: '40px',
  margin: '20px',
  fontSize: '1rem',
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
