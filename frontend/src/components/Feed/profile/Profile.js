import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import * as styles from "./Profile.styles";
import { debounce } from "lodash";
import defaultUser from "../../../images/default_profile.jpg";

const BASE_URL = import.meta.env.VITE_API_URL;

const Profile = ({ user, loading, updateProfilePicture, updateProfile }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [popupUsers, setPopupUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [updating, setUpdating] = useState(false);
  const [posts, setPosts] = useState([]);
  const token = useSelector((state) => state.user.token);
  const loggedInUserId = useSelector((state) => state.user?.user?._id);
  console.log(filteredUsers)

  useEffect(() => {
    if (showPopup && token) {
      fetchUsersData(popupType);
    }
  }, [showPopup, popupType, token]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(popupUsers);
    } else {
      setFilteredUsers(
        popupUsers.filter((user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, popupUsers]);

  const fetchUsersData = async (type) => {
    try {
      if (!token) return console.error("No token found");

      const endpoint = type === "followers"
        ? `${BASE_URL}/users/${user._id}/followers`
        : `${BASE_URL}/users/${user._id}/following`;

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token} ` },
      });


      const followingResponse = await axios.get(`${BASE_URL}/users/${loggedInUserId}/following`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const followingIds = new Set(followingResponse.data.following.map(u => u._id));

      const usersWithFollowStatus = response.data[type].map(user => ({
        ...user,
        isFollowing: followingIds.has(user._id),
      }));

      setPopupUsers(usersWithFollowStatus);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleFollowToggle = async (targetUserId, isCurrentlyFollowing) => {
    try {
      const url = `${BASE_URL}/users/${isCurrentlyFollowing ? 'unfollow' : 'follow'}`;
      await axios.post(
        url,
        { userId: loggedInUserId, userIdToUnfollow: targetUserId, userIdToFollow: targetUserId },
        { headers: { Authorization: `Bearer ${token} ` } }
      );

      // Update the local state to reflect the following status
      setPopupUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === targetUserId ? { ...user, isFollowing: !isCurrentlyFollowing } : user
        )
      );

      // Update the user's following state
      if (isCurrentlyFollowing) {
        user.following = user.following.filter((id) => id !== targetUserId);
      } else {
        user.following.push(targetUserId);
      }
      updateProfile(user);  // Make sure to send updated profile to parent component
      closePopup();
    } catch (err) {
      console.log(err);

    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePopup = (type) => {
    setPopupType(type);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupUsers([]);
  };

  const handleUserClick = (user) => {
    setSelectedUser(user); // Set the clicked user
    setShowPopup(false); // Close popup when user is selected
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewProfilePic(file);
    }
  };

  const handleProfilePicUpload = async () => {
    if (!newProfilePic) return;

    const formData = new FormData();
    formData.append("profile_picture", newProfilePic);

    setUpdating(true);

    try {
      const response = await axios.put(
        `${BASE_URL}/users/${user._id}/updateProfilePicture`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      updateProfilePicture(response.data.user);

    } catch (error) {
      console.error("Error updating profile picture", error);

    } finally {
      setUpdating(false);
    }
  };
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  const togglePosts = () => {
    setPosts((prev) => !prev);
  };
  return (
    <div style={styles.profileContainer}>
      {selectedUser ? (
        // Display selected user details
        <>
          <div style={styles.profileHeader}>
            <div style={styles.profileImage}>
              <img
                src={
                  selectedUser.profile_picture
                    ? selectedUser.profile_picture
                    : "/default_profile.jpg"
                }
                alt={selectedUser.username}
              />
            </div>
            <div style={styles.profileInfo}>
              <div style={styles.usernameAndPosts}>
                <h2 style={styles.userName}>{selectedUser.username}</h2>
              </div>
              <p style={styles.userBio}>{selectedUser.bio || "No bio available"}</p>
              <div style={styles.followersFollowing}>
                <p>Followers: {selectedUser.followers?.length || 0}</p>
                <p>Following: {selectedUser.following?.length || 0}</p>
              </div>
            </div>
          </div>
          <button onClick={() => setSelectedUser(null)}>Back</button>
        </>
      ) : (
        // Main profile display
        <>
          <div style={styles.profileHeader}>
            <div>
              <img
                src={
                  user.profile_picture
                    ? user.profile_picture
                    : defaultUser
                }
                alt={user.username}
                style={styles.profileImage}
              />
            </div>
            <div style={styles.profileInfo}>
              <div style={styles.usernameAndPosts}>
                <h2 style={styles.userName}>{user.username}</h2>
              </div>
              <p style={styles.userBio}>{user.bio}</p>
              <div style={styles.followersFollowing}>
                <span onClick={() => handlePopup("followers")}>
                  {user.followers?.length || 0} Followers
                </span>
                <span onClick={() => handlePopup("following")}>
                  {user.following?.length || 0} Following
                </span>
                <span onClick={togglePosts}>
                  {user.posts ? user.posts.length : 0} Posts
                </span>
              </div>
            </div>
          </div>
          {/* Display Posts */}

          {showPopup && (
            <div style={styles.popup}>
              <div style={styles.popupContent}>
                <h3>{popupType === "followers" ? "Followers" : "Following"}</h3>
                <div>
                  <div>
                    <input
                      type="text"
                      placeholder="Search user"
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </div>
                </div>
                <div>
                  <table>
                    <tbody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((popupUser) => (
                          <tr key={popupUser._id} style={styles.profilesDiv}>
                            <td>
                              <img height={50}
                                src={popupUser.profile_picture ? popupUser.profile_picture : defaultUser}
                                alt={popupUser.username}
                                style={styles.profileImageToggle}
                              />
                            </td>
                            <td>{popupUser.username}</td>
                            <td>
                              {popupUser._id !== loggedInUserId && (
                                <button
                                  style={styles.followUnfollow}
                                  onClick={() => handleFollowToggle(popupUser._id, popupUser.isFollowing)}
                                >
                                  {popupUser.isFollowing ? "Unfollow" : "Follow"}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3">No users to display</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <button onClick={closePopup}>Close</button>
              </div>
            </div>
          )}

        </>
      )}
    </div>
  );
};
export default Profile;