
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { debounce } from 'lodash';
const styles = {
findGroupContainer: {
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
  joinLeaveButton: {
  backgroundColor: '#c093fc',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  width: '120px',
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

const Group = () => {
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
    <div style={styles.findGroupContainer}>
      <h2>{personalityType} Community - Find Groups</h2>
      <div style={styles.searchBarContainer}>
        <input
          type="text"
          placeholder="Search by group name"
          value={searchTerm}
           onChange={handleSearchChange}
           style={styles.searchInput}
        />
      </div>
      {filteredGroups.length === 0 ? (
        <p>No groups found</p>
      ) : (
        <table style={styles.table}>
          <thead style={styles.tHead}>
            <tr>
              <th>Group Name</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody style={styles.tBody}>
            {filteredGroups.map((group) => (
              <tr key={group._id}>
                <td>{group.name}</td>
                <td>{group.description}</td>
                <td>
                  <button
                    onClick={() => handleJoinLeaveToggle(group._id, group.isJoined)}
                    style={styles.joinLeaveButton}
                  >
                    {group.isJoined ? 'Leave Group' : 'Join Group'}
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

export default Group;
