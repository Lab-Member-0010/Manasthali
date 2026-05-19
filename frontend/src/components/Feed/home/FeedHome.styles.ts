import React from 'react'

// NOTE: hover/media effects omitted — use onMouseEnter/onMouseLeave

export const feedContainer: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
}

export const postCardContainer: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  marginTop: '10px',
}

export const cardHeader: React.CSSProperties = {
  borderBottom: '1px solid lightgray',
  backgroundColor: 'rgb(248, 248, 248)',
  margin: 0,
}

export const userName: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 'bold',
  marginLeft: '5px',
}

export const commentTextbox: React.CSSProperties = {
  borderBottom: '1px solid lightgray',
}

export const commentTextField: React.CSSProperties = {
  border: 'none',
  marginLeft: '2px',
  width: '80%',
  fontSize: '15px',
}

export const emojiButton: React.CSSProperties = {
  background: 'none',
  border: 'none',
  width: '8%',
  height: '7px',
  color: '#6e6767',
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

export const commentPostButton: React.CSSProperties = {
  background: 'none',
  color: 'blue',
  fontWeight: 'bold',
  fontSize: '15px',
  border: 'none',
  marginLeft: '2%',
  width: '8%',
}

export const postDescription: React.CSSProperties = {
  margin: 0,
  fontSize: '20px',
}

export const postImage: React.CSSProperties = {
  width: '550px',
  height: '400px',
}

export const likeButton: React.CSSProperties = {
  marginRight: '5px',
  background: 'none',
  border: 'none',
  padding: 0,
}

export const commentButton: React.CSSProperties = {
  margin: '0px 5px 0px 15px',
  background: 'none',
  border: 'none',
  padding: 0,
}

export const shareButton: React.CSSProperties = {
  margin: '0px 5px 0px 15px',
  background: 'none',
  border: 'none',
  padding: 0,
}

export const roundedProfile: React.CSSProperties = {
  height: '35px',
  width: '35px',
  border: '1px solid black',
  borderRadius: '50%',
  margin: '0px 10px 0px 10px',
}

export const likeCommentShareButton: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
}

export const likeCount: React.CSSProperties = {
  fontSize: '16px',
}

export const commentCount: React.CSSProperties = {
  fontSize: '16px',
}

export const shareCount: React.CSSProperties = {
  fontSize: '16px',
}

export const modalContent: React.CSSProperties = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'rgb(251, 248, 248)',
  borderRadius: '10px',
  zIndex: 9999,
  height: '70%',
  width: '70%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
}

export const modalOverlay: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0, 0, 0, 0.5)',
  zIndex: 9998,
}

export const closeModalButton: React.CSSProperties = {
  background: 'none',
  width: '4%',
  height: '100%',
  border: '1px solid gray',
  borderRadius: '50%',
  fontWeight: 'bold',
  fontSize: '10px',
  color: 'lightgray',
  backgroundColor: 'white',
}

export const closeButton: React.CSSProperties = {
  width: '100%',
  height: '4%',
  display: 'flex',
  justifyContent: 'end',
  paddingRight: '5px',
}

export const postComments: React.CSSProperties = {
  width: '50%',
  height: '100%',
  textAlign: 'start',
  display: 'flex',
  flexDirection: 'column',
}

export const postMedia: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '50%',
  height: '100%',
  borderRadius: '10px 0px 0px 10px',
}

export const modalPostImage: React.CSSProperties = {
  width: '100%',
  height: '100%',
}

export const postCommentsInnerDiv: React.CSSProperties = {
  height: '96%',
  width: '100%',
  maxHeight: '100%',
  overflowY: 'scroll',
  scrollbarWidth: 'thin',
}
