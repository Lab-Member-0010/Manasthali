import React, { useState, useEffect, Suspense, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { signOut } from "../../redux-config/UserSlice";
import Header from "./Header";
import Sidebar from "./Sidebar";
import RightNav from "./RightNav";

const Chat = lazy(() => import("./chat/ChatList"));
const FeedHome = lazy(() => import("./home/FeedHome"));
const GroupChat = lazy(() => import("./group-chat/GroupChat"));
const Group = lazy(() => import("./group/Group"));
const Notification = lazy(() => import("./notification/Notification"));
const MentalCoach = lazy(() => import("./Mental-Coach/MentalCoach"));
const Profile = lazy(() => import("./profile/Profile"));
const Challenge = lazy(() => import("./challenge/Challenege"));
const FindFriend = lazy(() => import("./Find-friend/FindFriend"));
const Story = lazy(() => import("./story/Story"));
const Post = lazy(() => import("./post/Post"));
const ProfileSetting = lazy(() => import("./profile/ProfileSetting"));
const Community = lazy(() => import("./community/community"));

const BASE_URL = import.meta.env.VITE_API_URL;

const Feed = () => {
  const { token } = useSelector((store) => store.user);
  const userId = useSelector((state) => state.user.user._id);
  const dispatch = useDispatch();

  const [activeComponent, setActiveComponent] = useState("home");
  const [profileData, setProfileData] = useState(null);
  const [feedRefreshKey, setFeedRefreshKey] = useState(0);
  const [selectedChatGroup, setSelectedChatGroup] = useState(null);

  const handlePostCreated = () => {
    setFeedRefreshKey((k) => k + 1);
    setActiveComponent("home");
  };

  const handleChatSelect = (group) => {
    setSelectedChatGroup(group);
    setActiveComponent("group-chat");
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfileData(response.data.user);
      } catch (error) {
        console.error("Failed to fetch profile data:", error.response?.data || error.message);
      }
    };
    fetchProfileData();
  }, [userId, token]);

  const updateProfilePicture = (newProfileData) => {
    setProfileData(newProfileData);
  };

  const handleProfileClick = () => {
    setActiveComponent("profile");
  };

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "home":
        return <FeedHome refreshKey={feedRefreshKey} />;
      case "groups":
        return <Group onChatSelect={handleChatSelect} />;
      case "chat":
        return <Chat />;
      case "group-chat":
        return <GroupChat preselectedGroup={selectedChatGroup} onBackToGroups={() => { setSelectedChatGroup(null); setActiveComponent("groups"); }} />;
      case "notifications":
        return <Notification />;
      case "find-friends":
        return <FindFriend />;
      case "profile":
        return <Profile user={profileData} updateProfilePicture={updateProfilePicture} />;
      case "mental-coach":
        return <MentalCoach />;
      case "challenge":
        return <Challenge />;
      case "post":
        return <Post onPostCreated={handlePostCreated} />;
      case "setting":
        return <ProfileSetting />;
      case "community":
        return <Community />;
      default:
        return <FeedHome />;
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <br /> <br /> <br />
      <div className="flex flex-1 w-full mt-[18px]">
        <Sidebar activeComponent={activeComponent} setActiveComponent={setActiveComponent} />

        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 md:px-16 bg-white text-lg md:text-2xl">
          <div className="bg-white mb-5 overflow-y-scroll">
            <Suspense fallback={<div className="p-5 text-purple-600 text-center">Loading...</div>}>
              {activeComponent === "home" && (
                <div className="bg-white text-black h-20 max-h-[500px] overflow-y-auto border-b border-gray-300">
                  <Story />
                </div>
              )}
              {renderActiveComponent()}
            </Suspense>
          </div>
        </div>

        <RightNav
          profileData={profileData}
          onProfileClick={handleProfileClick}
          setActiveComponent={setActiveComponent}
          onSignOut={() => dispatch(signOut())}
        />
      </div>
    </div>
  );
};

export default Feed;
