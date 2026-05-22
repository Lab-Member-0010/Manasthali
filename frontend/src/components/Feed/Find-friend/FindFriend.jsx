import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { debounce } from 'lodash';
import { updateUserProfile } from '../../../redux-config/UserSlice';
import Api from "../../../apis/Api";

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
    <div className="max-w-4xl mx-auto my-8 p-6 bg-gray-50 rounded-2xl shadow-lg text-center">
      <h2>Find Friends</h2>
      <div className="mb-5">
        <input
          type="text"
          placeholder="Search by username"
          value={searchTerm}
           onChange={handleSearchChange}
          className="w-full px-4 py-2 text-base border border-gray-300 rounded-md mb-4"
        />
      </div>
      {filteredUsers.length === 0 ? (
        <p>No users found</p>
      ) : (
        <table className="w-full border-collapse mt-4 bg-white rounded-lg overflow-hidden shadow">
          <thead className="bg-purple-400 text-white">
            <tr>
              <th>Profile Picture</th>
              <th>Username</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody >
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>
                  <img
                    src={user.profile_picture ? user.profile_picture : '/user.png'}
                    alt={user.username}
                    className="w-14 h-14 rounded-full object-cover border-2 border-gray-300"
                    onError={(e) => { e.target.src = '/user.png'; }}
                  />
                </td>
                <td>{user.username}</td>
                <td>
                  <button
                    onClick={() => handleFollowToggle(user._id, user.isFollowing)}
                    className="px-5 py-2 rounded-full bg-purple-400 text-white font-medium hover:bg-purple-500 transition-colors w-24"
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
