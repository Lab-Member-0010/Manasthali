import React from 'react'

// NOTE: hover/media effects omitted — use onMouseEnter/onMouseLeave

export const otpContainer: React.CSSProperties = {
  backgroundImage: "url('../../images/spore.gif')",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  paddingRight: '50px',
}

export const otpBox: React.CSSProperties = {
  backgroundColor: 'transparent',
  padding: '10px',
  borderRadius: '20px',
  boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.3)',
  backdropFilter: 'blur(10px)',
  textAlign: 'center',
  width: '420px',
  maxWidth: '1000px',
  position: 'relative',
  right: '0',
}

export const otpLogo: React.CSSProperties = {
  width: '100px',
  height: '100px',
  backgroundImage: "url('../../images/Manasthali.png')",
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'contain',
  margin: '10px auto 20px auto',
  display: 'block',
}

export const inputContainer: React.CSSProperties = {
  width: '80%',
  marginTop: '20px',
  marginBottom: '20px',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
}

export const inputField: React.CSSProperties = {
  width: '400px',
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

export const verifyOtpBtn: React.CSSProperties = {
  color: 'black',
  backgroundColor: '#55aafe',
  fontWeight: 'bold',
  borderBottom: '1px solid black',
  width: '200px',
  height: '40px',
  margin: '20px',
  fontSize: '1rem',
}
