import React from 'react'

// NOTE: hover/focus pseudo-class effects omitted — use onMouseEnter/onMouseLeave

export const chatContainer: React.CSSProperties = {
  display: 'flex',
  height: '100%',
  backgroundColor: '#fafafa',
  flexWrap: 'wrap',
  border: '1px solid black',
}

export const sidebar: React.CSSProperties = {
  width: '20%',
  padding: '20px',
  position: 'fixed',
  borderRight: '1px solid lightgray',
}

export const sidebarWrapper: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
}

export const sidebarHeader: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '10px',
  position: 'sticky',
  top: 0,
  zIndex: 10,
  fontSize: '1.5em',
  textAlign: 'center',
  color: '#5f4b8b',
}

export const userList: React.CSSProperties = {
  maxHeight: '520px',
  overflowY: 'auto',
  flex: 1,
  padding: '10px',
}

export const userItem: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '10px',
  cursor: 'pointer',
  border: '1px solid lightgray',
  height: '80px',
  borderRadius: '5px',
  marginBottom: '15px',
  transition: 'background-color 0.3s ease',
}

export const userImg: React.CSSProperties = {
  width: '60px',
  height: '60px',
  border: '1px solid black',
  borderRadius: '50%',
  marginRight: '15px',
}

export const username: React.CSSProperties = {
  fontWeight: 'bold',
  color: '#463961',
  fontSize: '20px',
}

export const chatPanel: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  backgroundColor: '#fff',
  marginLeft: '28%',
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
}

export const chatHeader: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '10px 15px',
  position: 'sticky',
  color: 'black',
  top: 0,
  zIndex: 10,
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  width: '100%',
}

export const chatUserImg: React.CSSProperties = {
  width: '50px',
  height: '50px',
  border: '1px solid black',
  borderRadius: '50%',
  marginRight: '15px',
}

export const chatBody: React.CSSProperties = {
  padding: '15px',
  height: '460px',
  flexGrow: 1,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  maxHeight: 'calc(100% - 120px)',
}

export const messageList: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
}

export const message: React.CSSProperties = {
  padding: '10px',
  borderRadius: '8px',
  marginBottom: '10px',
  maxWidth: '80%',
  position: 'relative',
  fontSize: '0.95rem',
}

export const sent: React.CSSProperties = {
  border: '1px solid lightgray',
  backgroundColor: '#f4f4f4',
  width: '40%',
  height: 'auto',
  alignSelf: 'flex-end',
}

export const received: React.CSSProperties = {
  border: '1px solid gray',
  backgroundColor: '#e5daf6',
  color: 'gray',
  width: '40%',
  height: 'auto',
  alignSelf: 'flex-start',
}

export const read: React.CSSProperties = {
  color: '#4bb543',
}

export const unread: React.CSSProperties = {
  color: 'black',
}

export const noChatSelected: React.CSSProperties = {
  textAlign: 'center',
  padding: '20px',
  color: '#7c6d96',
}

export const newMessage: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '10px 20px',
  backgroundColor: '#f1f1f1',
  position: 'sticky',
  bottom: 0,
  zIndex: 10,
  border: '1px solid #d4c7e0',
  width: '100%',
}

export const textArea: React.CSSProperties = {
  width: '100%',
  height: '40px',
  padding: '10px',
  borderRadius: '20px',
  border: '1px solid #d4c7e0',
  marginRight: '10px',
  fontSize: '1rem',
  outline: 'none',
}

export const sentbutton: React.CSSProperties = {
  backgroundColor: '#c093fc',
  color: 'white',
  border: 'none',
  borderRadius: '20px',
  padding: '10px 20px',
  cursor: 'pointer',
  fontSize: '1rem',
}

export const emojiButton: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: '1.5rem',
  cursor: 'pointer',
  marginRight: '10px',
  color: '#675e70',
}

export const emojiPickerContainer: React.CSSProperties = {
  position: 'absolute',
  bottom: '70px',
  left: '20px',
  zIndex: 15,
  backgroundColor: '#ffffff',
  border: '1px solid #d4c7e0',
  borderRadius: '10px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
}
