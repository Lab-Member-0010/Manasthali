import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { debounce } from 'lodash';
import { updateUserProfile } from '../../../redux-config/UserSlice';
import Api from "../../../apis/Api";
const styles = {
findFriendContainer: {
  maxWidth: '900px',
  margin: '50px auto',
  padding: '25px',
  backgroundColor: '#f9f9f9',
  borderRadius: '15px',
  boxShadow: '0 8px 15px rgba(0, 0, 0, 0.2)',
  textAlign: 'center',
},
  searchBarContainer: {
  marginBottom: '20px',
},
  searchInput: {
  width: '100%',
  padding: '10px',
  fontSize: '16px',
  borderRadius: '5px',
  border: '1px solid #ccc',
},
  table: {
  width: '100%',
  borderCollapse: 'collapse',
  borderSpacing: 0,
  marginTop: '20px',
  backgroundColor: 'white',
  borderRadius: '10px',
  overflow: 'hidden',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
},
  tHead: {
  backgroundColor: '#c093fc',
  color: 'white',
},
  tBody: {
  profilePicture: {
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  objectFit: 'cover',
  border: '3px solid #dcdcdc',
  transition: 'transform 0.3s ease, border-color 0.3s ease',
},
  followUnfollow: {
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
},
  },
};

const BASE_URL = import.meta.env.VITE_API_URL;

const FindFriend = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user?.user);
  const userId = currentUser?._id;
  const token = useSelector((state) => state.user?.token);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${Api.GET_COMMUNITY_USERS}/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const followingResponse = await axios.get(`${BASE_URL}/users/${userId}/following`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const followingIds = new Set(followingResponse.data.following.map(user => user._id));

        const usersWithFollowStatus = response.data.users.map((user) => ({
          ...user,
          isFollowing: followingIds.has(user._id),
        }));
        setUsers(usersWithFollowStatus);
        setFilteredUsers(usersWithFollowStatus);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userId, token]);

  const filterUsers = (term) => {
    if (term.trim() === '') {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter(user =>
        user.username.toLowerCase().includes(term.toLowerCase())
      ));
    }
  };

  // Wrap debounce in useCallback so a single debounced instance is reused across renders
  const debouncedSearch = useCallback(
    debounce((term) => filterUsers(term), 500),
    [users]
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleFollowToggle = async (targetUserId, isCurrentlyFollowing) => {
    try {
        const url = `${BASE_URL}/users/${isCurrentlyFollowing ? 'unfollow' : 'follow'}`;
        await axios.post(
            url,
            { userId, userIdToUnfollow: targetUserId, userIdToFollow: targetUserId }, // Corrected field names
            { headers: { Authorization: `Bearer ${token}` } }
        );

        setUsers(prevUsers =>
            prevUsers.map(user =>
                user._id === targetUserId ? { ...user, isFollowing: !isCurrentlyFollowing } : user
            )
        );
        setFilteredUsers(prevFilteredUsers =>
            prevFilteredUsers.map(user =>
                user._id === targetUserId ? { ...user, isFollowing: !isCurrentlyFollowing } : user
            )
        );

        // Update Redux user's following list so profile counts refresh immediately
        const updatedFollowing = isCurrentlyFollowing
          ? (currentUser.following || []).filter(id => id.toString() !== targetUserId.toString())
          : [...(currentUser.following || []), targetUserId];
        dispatch(updateUserProfile({ ...currentUser, following: updatedFollowing }));
    } catch (err) {
        alert(err.response?.data?.message || 'Action failed. Please try again.');
    }
};

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={styles.findFriendContainer}>
      <h2>Find Friends</h2>
      <div style={styles.searchBarContainer}>
        <input
          type="text"
          placeholder="Search by username"
          value={searchTerm}
           onChange={handleSearchChange}
          style={styles.searchInput}
        />
      </div>
      {filteredUsers.length === 0 ? (
        <p>No users found</p>
      ) : (
        <table style={styles.table}>
          <thead style={styles.tHead}>
            <tr>
              <th>Profile Picture</th>
              <th>Username</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody style={styles.tBody}>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>
                  <img
                    src={user.profile_picture ? user.profile_picture : '/user.png'}
                    alt={user.username}
                    style={styles.profilePicture}
                    onError={(e) => { e.target.src = '/user.png'; }}
                  />
                </td>
                <td>{user.username}</td>
                <td>
                  <button
                    onClick={() => handleFollowToggle(user._id, user.isFollowing)}
                    style={styles.followUnfollow}
                  >
                    {user.isFollowing ? 'Unfollow' : 'Follow'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FindFriend;
