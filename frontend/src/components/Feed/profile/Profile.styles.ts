import React from 'react'

// NOTE: hover/media effects omitted — use onMouseEnter/onMouseLeave
// NOTE: compound selectors (.followersFollowing span, .popupContent h3/ul/li/li span/button,
//       .ProfileContainer .SearchBarContainer, .ProfileContainer .SearchInput,
//       .ProfileContainer .FollowUnfollow and their pseudo-classes) and @media queries omitted

export const profileContainer: React.CSSProperties = {
  maxWidth: '900px',
  margin: '20px auto',
  padding: '10px',
  fontFamily: "'Arial', sans-serif",
  color: '#333',
}

export const profileHeader: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '30px',
  paddingBottom: '20px',
  borderBottom: '1px solid #ddd',
}

export const profileImage: React.CSSProperties = {
  flexShrink: 0,
  position: 'relative',
  width: '100px',
  height: '100px',
  borderRadius: '50%',
  border: '1px solid black',
}

export const toggleButton: React.CSSProperties = {
  margin: 0,
}

export const profileImageToggle: React.CSSProperties = {
  flexShrink: 0,
  position: 'relative',
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  border: '1px solid black',
}

export const profileInfo: React.CSSProperties = {
  flexGrow: 1,
}

export const usernameAndPosts: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '10px',
}

export const userName: React.CSSProperties = {
  fontSize: '28px',
  fontWeight: 'bold',
  margin: 0,
  textAlign: 'left',
}

export const userBio: React.CSSProperties = {
  fontSize: '14px',
  color: '#8e8e8e',
  margin: '10px 0',
}

export const followersFollowing: React.CSSProperties = {
  display: 'flex',
  gap: '30px',
  fontSize: '16px',
  fontWeight: '600',
}

export const popup: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}

export const popupContent: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '10px',
  maxWidth: '450px',
  width: '100%',
  boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
}

export const profilesDiv: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '390px',
}

export const followUnfollow: React.CSSProperties = {
  backgroundColor: '#c093fc',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  width: '100px',
  fontSize: '1rem',
  fontWeight: '500',
  borderRadius: '25px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease, transform 0.2s ease',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}
