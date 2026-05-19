import React from 'react'

// NOTE: hover/media effects omitted — use onMouseEnter/onMouseLeave

export const quizWrapper: React.CSSProperties = {
  backgroundImage: "url('https://i.pinimg.com/originals/cf/85/d9/cf85d966c302f3728a0e8f81805c132a.gif')",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
}

export const quizContainer: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.3)',
  borderRadius: '15px',
  padding: '40px',
  width: '700px',
  height: '300px',
  boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.15)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
}

export const questionContainer: React.CSSProperties = {
  textAlign: 'center',
}

export const question: React.CSSProperties = {
  fontSize: '1.5rem',
  marginBottom: '30px',
  fontWeight: 'bold',
  color: '#333',
}

export const sliderOptions: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}

export const label: React.CSSProperties = {
  fontSize: '1.2rem',
  width: '15%',
  textAlign: 'center',
  color: '#333',
}

export const circles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '70%',
}

export const circle: React.CSSProperties = {
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  border: '3px solid yellow',
  backgroundColor: 'transparent',
  cursor: 'pointer',
}

export const circle1: React.CSSProperties = {
  width: '50px',
  height: '50px',
  borderColor: '#66BB6A',
}

export const circle2: React.CSSProperties = {
  width: '40px',
  height: '40px',
  borderColor: '#9CCC65',
}

export const circle3: React.CSSProperties = {
  borderColor: '#90CAF9',
  width: '30px',
  height: '30px',
}

export const circle4: React.CSSProperties = {
  width: '40px',
  height: '40px',
  borderColor: '#FFA726',
}

export const circle5: React.CSSProperties = {
  width: '50px',
  height: '50px',
  borderColor: '#EF5350',
}

export const circle1Active: React.CSSProperties = {
  color: '#66BB6A',
  backgroundColor: '#66BB6A',
}

export const circle2Active: React.CSSProperties = {
  color: '#9CCC65',
  backgroundColor: '#9CCC65',
}

export const circle3Active: React.CSSProperties = {
  color: '#90CAF9',
  backgroundColor: '#90CAF9',
}

export const circle4Active: React.CSSProperties = {
  color: '#FFA726',
  backgroundColor: '#FFA726',
}

export const circle5Active: React.CSSProperties = {
  color: '#EF5350',
  backgroundColor: '#EF5350',
}

export const navigationButtons: React.CSSProperties = {
  marginTop: '30px',
  display: 'flex',
  justifyContent: 'space-between',
}

export const preNextButton: React.CSSProperties = {
  border: 'none',
  padding: '0.75rem 1.5rem',
  fontSize: '1.25rem',
  borderRadius: '40px',
  backgroundColor: '#c093fc',
  color: 'white',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
}

export const preNextButtonDisabled: React.CSSProperties = {
  backgroundColor: '#cfcfcf',
  color: 'gray',
}
