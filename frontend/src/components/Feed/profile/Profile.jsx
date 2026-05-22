import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { debounce } from "lodash";
import defaultUser from "@assets/default_profile.jpg";
import Api from "../../../apis/Api";

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
  const [showPosts, setShowPosts] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [postsCount, setPostsCount] = useState(0);
  const token = useSelector((state) => state.user.token);
  const loggedInUserId = useSelector((state) => state.user?.user?._id);

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

  // Fetch user posts count on mount
  useEffect(() => {
    if (user?._id && token) {
      axios.get(`${Api.GET_USER_POST}/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => {
        const posts = res.data.posts || [];
        setPostsCount(posts.length);
        setUserPosts(posts);
      }).catch(err => console.error("Error fetching posts:", err));
    }
  }, [user?._id, token]);

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
      // updateProfile may not be passed from the parent — call it only when provided
      if (typeof updateProfile === "function") {
        updateProfile(user);
      }
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
            Authorization: `Bearer ${token}`,
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
    setShowPosts((prev) => !prev);
  };
  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      {selectedUser ? (
        // Display selected user details
        <>
          <div className="flex items-center gap-6 p-6">
            <div className="w-32 h-32 rounded-full border-4 border-gray-200 flex-shrink-0 relative overflow-hidden">
              <img
                src={
                  selectedUser.profile_picture
                    ? selectedUser.profile_picture
                    : defaultUser
                }
                alt={selectedUser.username}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2.5">
                <h2 className="text-2xl font-bold m-0 text-left">{selectedUser.username}</h2>
              </div>
              <p className="text-gray-600 mt-2">{selectedUser.bio || "No bio available"}</p>
              <div className="flex gap-4 mt-4 text-gray-600">
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
          <div className="flex items-center gap-6 p-6">
            <div>
              <img
                src={
                  user.profile_picture
                    ? user.profile_picture
                    : defaultUser
                }
                alt={user.username}
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2.5">
                <h2 className="text-2xl font-bold m-0 text-left">{user.username}</h2>
              </div>
              <p className="text-gray-600 mt-2">{user.bio}</p>
              <div className="flex gap-4 mt-4 text-gray-600">
                <span onClick={() => handlePopup("followers")}>
                  {user.followers?.length || 0} Followers
                </span>
                <span onClick={() => handlePopup("following")}>
                  {user.following?.length || 0} Following
                </span>
                <span onClick={togglePosts}>
                  {postsCount} Posts
                </span>
              </div>
            </div>
          </div>
          {/* Display Posts */}

          {showPopup && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
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
                          <tr key={popupUser._id} className="flex items-center justify-between">
                            <td>
                              <img height={50}
                                src={popupUser.profile_picture ? popupUser.profile_picture : defaultUser}
                                alt={popupUser.username}
                                className="w-12 h-12 rounded-full object-cover border border-gray-900"
                              />
                            </td>
                            <td>{popupUser.username}</td>
                            <td>
                              {popupUser._id !== loggedInUserId && (
                                <button
                                  className="px-4 py-2 rounded-full font-medium cursor-pointer bg-purple-400 text-white hover:bg-purple-500"
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

          {/* Display Posts */}
          {showPosts && (
            <div className="mt-5">
              <h3>Posts</h3>
              {userPosts.length === 0 ? (
                <p>No posts yet.</p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {userPosts.map((post) => (
                    <div key={post._id} className="w-72 border border-gray-200 rounded-lg p-4">
                      {post.media?.[0] && (
                        <img src={post.media[0]} alt="Post" className="w-full rounded mb-2" />
                      )}
                      <p>{post.description}</p>
                      <small>{post.likes?.length || 0} likes · {post.comments?.length || 0} comments</small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </>
      )}
    </div>
  );
};
export default Profile;
