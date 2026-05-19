import React from 'react'

// NOTE: hover/media effects omitted — use onMouseEnter/onMouseLeave

export const signupContainer: React.CSSProperties = {
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

export const signupBox: React.CSSProperties = {
  backgroundColor: 'transparent',
  borderRadius: '20px',
  boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.3)',
  backdropFilter: 'blur(10px)',
  textAlign: 'center',
  width: '470px',
  height: '570px',
  maxWidth: '1000px',
  position: 'relative',
  right: '0',
  margin: '40px auto',
}

export const signupLogo: React.CSSProperties = {
  width: '80px',
  height: '80px',
  backgroundImage: "url('../../images/Manasthali.png')",
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'contain',
  margin: '0',
  display: 'block',
}

export const inputContainer: React.CSSProperties = {
  position: 'relative',
  marginBottom: '1rem',
  backgroundColor: 'transparent',
  width: '80%',
  display: 'flex',
  flexDirection: 'column',
}

export const inputField: React.CSSProperties = {
  width: '440px',
  height: '40px',
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
  right: '-65px',
  top: '50%',
  transform: 'translateY(-50%)',
  fontSize: '14px',
  color: 'black',
  fontWeight: 'bold',
  cursor: 'pointer',
}

export const upBtn: React.CSSProperties = {
  color: 'black',
  backgroundColor: '#55aafe',
  fontWeight: 'bold',
  borderBottom: '1px solid black',
  width: '200px',
  height: '40px',
  margin: '20px',
  fontSize: '1rem',
}

export const upBtnOutline: React.CSSProperties = {
  color: 'black',
  backgroundColor: '#55aafe',
  fontWeight: 'bold',
  borderBottom: '1px solid black',
  width: '200px',
  height: '40px',
  margin: '20px',
  fontSize: '1rem',
}

export const errorText: React.CSSProperties = {
  color: 'rgb(254, 73, 73)',
  fontSize: '0.7rem',
  textAlign: 'left',
  width: '410px',
  paddingLeft: '5px',
}

export const errorBorder: React.CSSProperties = {
  borderColor: 'rgb(254, 73, 73)',
}

export const row: React.CSSProperties = {
  gap: '0px',
}
