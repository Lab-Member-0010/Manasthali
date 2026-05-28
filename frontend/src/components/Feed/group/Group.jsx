
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { debounce } from 'lodash';

const BASE_URL = import.meta.env.VITE_API_URL;

const Group = ({ onChatSelect }) => {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const userId = useSelector((state) => state.user?.user?._id);
  const token = useSelector((state) => state.user?.token);
  const personalityType = useSelector((state) => state.user?.user?.personality_type); // Fetch user's personality type

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        // Fetch groups based on the user's personality type (e.g., INFJ)
        const response = await axios.get(`${BASE_URL}/groups/get-groups/${personalityType}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch user's joined groups
        const joinedResponse = await axios.get(`${BASE_URL}/groups/view/joinedList`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const joinedIds = new Set(joinedResponse.data.map(group => group._id));

        const groupsWithJoinStatus = response.data.map((group) => ({
          ...group,
          isJoined: joinedIds.has(group._id),
        }));
        setGroups(groupsWithJoinStatus);
        setFilteredGroups(groupsWithJoinStatus);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch groups');
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [userId, token, personalityType]);

  const filterGroups = (term) => {
    if (term.trim() === '') {
      setFilteredGroups(groups);
    } else {
      setFilteredGroups(groups.filter(group =>
        group.name.toLowerCase().includes(term.toLowerCase())
      ));
    }
  };

  // Wrap debounce in useCallback so a single debounced instance is reused across renders
  const debouncedSearch = useCallback(
    debounce((term) => filterGroups(term), 500),
    [groups]
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleJoinLeaveToggle = async (groupId, isCurrentlyJoined) => {
    try {
      const url = `${BASE_URL}/groups/${groupId}/${isCurrentlyJoined ? 'leave' : 'join'}`;
      await axios.post(
        url,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setGroups(prevGroups =>
        prevGroups.map(group =>
          group._id === groupId ? { ...group, isJoined: !isCurrentlyJoined } : group
        )
      );
      setFilteredGroups(prevFilteredGroups =>
        prevFilteredGroups.map(group =>
          group._id === groupId ? { ...group, isJoined: !isCurrentlyJoined } : group
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed. Please try again.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-4xl w-full mx-auto my-8 p-6 bg-gray-50 rounded-2xl shadow-lg text-center px-4">
      <h2>{personalityType} Community - Find Groups</h2>
      <div className="mb-5">
        <input
          type="text"
          placeholder="Search by group name"
          value={searchTerm}
           onChange={handleSearchChange}
           className="w-full px-4 py-2 text-base border border-gray-300 rounded-md mb-4"
        />
      </div>
      {filteredGroups.length === 0 ? (
        <p>No groups found</p>
      ) : (
        <div className="overflow-x-auto">
        <table className="w-full border-collapse mt-4 bg-white rounded-lg overflow-hidden shadow">
          <thead className="bg-purple-400 text-white">
            <tr>
              <th>Group Name</th>
              <th>Description</th>
              <th>Action</th>
              <th>Chat</th>
            </tr>
          </thead>
          <tbody >
            {filteredGroups.map((group) => (
              <tr key={group._id}>
                <td>{group.name}</td>
                <td>{group.description}</td>
                <td>
                  <button
                    onClick={() => handleJoinLeaveToggle(group._id, group.isJoined)}
                    className="px-5 py-2 rounded-full bg-purple-400 text-white font-medium hover:bg-purple-500 transition-colors w-28"
                  >
                    {group.isJoined ? 'Leave Group' : 'Join Group'}
                  </button>
                </td>
                <td>
                  {group.isJoined && (
                    <button
                      onClick={() => onChatSelect && onChatSelect(group)}
                      className="px-5 py-2 rounded-full bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors w-28"
                    >
                      Chat
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
};

export default Group;
