import React from 'react'

// NOTE: hover/focus/active/disabled pseudo-class effects omitted — use onMouseEnter/onMouseLeave

export const container: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  background: 'white',
  color: 'black',
  fontFamily: 'Arial, sans-serif',
  overflow: 'hidden',
}

export const chatBox: React.CSSProperties = {
  width: '100%',
  maxWidth: '400px',
  height: '60vh',
  overflowY: 'auto',
  background: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '10px',
  padding: '15px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
  transition: '0.3s',
  position: 'relative',
}

export const message: React.CSSProperties = {
  maxWidth: '80%',
  padding: '10px',
  borderRadius: '10px',
  wordWrap: 'break-word',
  fontSize: '14px',
}

export const userMessage: React.CSSProperties = {
  alignSelf: 'flex-end',
  backgroundColor: '#c093fc',
  color: 'black',
  borderTopRightRadius: 0,
}

export const botMessage: React.CSSProperties = {
  alignSelf: 'flex-start',
  backgroundColor: '#f1f1f1',
  color: 'black',
  borderTopLeftRadius: 0,
}

export const inputBox: React.CSSProperties = {
  display: 'flex',
  width: '100%',
  maxWidth: '400px',
  marginTop: '10px',
  gap: '10px',
  position: 'absolute',
  bottom: '10px',
}

export const inputFields: React.CSSProperties = {
  flex: 1,
  padding: '10px',
  border: 'none',
  borderRadius: '20px',
  outline: 'none',
  fontSize: '16px',
  transition: 'all 0.3s ease',
  backgroundColor: 'white',
  color: 'black',
}

export const buttonSend: React.CSSProperties = {
  backgroundColor: '#c093fc',
  color: 'white',
  border: 'none',
  padding: '10px 15px',
  borderRadius: '20px',
  cursor: 'pointer',
  transition: '0.3s',
}
