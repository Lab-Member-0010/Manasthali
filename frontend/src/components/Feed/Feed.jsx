import React, { useState, useEffect } from "react";
import {
  Home as HomeIcon,
  Event as EventIcon,
  Chat as ChatIcon,
  Groups as GroupsIcon,
  Notifications as NotificationsIcon,
  PowerSettingsNew as PowerSettingsNewIcon,
  AddCircleOutline,
  Settings,
  PersonAddAlt1,
  Forum,
  Group as GroupIcon,
} from "@mui/icons-material";
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { signOut } from "../../redux-config/UserSlice";
import ManasthaliLogo from "@assets/Manasthali.png";
import Chat from "./chat/ChatList";
import FeedHome from "./home/FeedHome";
import GroupChat from "./group-chat/GroupChat";
import Group from "./group/Group";
import Notification from "./notification/Notification";
import MentalCoach from "./Mental-Coach/MentalCoach";
import Profile from "./profile/Profile";
import Challenge from "./challenge/Challenege";
import FindFriend from "./Find-friend/FindFriend";
import Story from "./story/Story";
import Post from "./post/Post";
import ProfileSetting from "./profile/ProfileSetting";
import Community from "./community/community";
import defaultProfile from "@assets/default_profile.jpg";


const BASE_URL = import.meta.env.VITE_API_URL;

const Feed = () => {
  const { token } = useSelector((store) => store.user);
  const userId = useSelector((state) => state.user.user._id);
  const dispatch = useDispatch();

  const [activeComponent, setActiveComponent] = useState("home");
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
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
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfileData(); // Fetch profile data when the component mounts
  }, [userId, token]);

  // Function to update profile data when the profile photo changes
  const updateProfilePicture = (newProfileData) => {
    setProfileData(newProfileData); // Update profile data
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
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-[10px] bg-white fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center">
          <img src={ManasthaliLogo} alt="Manasthali Logo" width={70} height={70} />
          <div className="text-4xl font-bold bg-gradient-to-r from-[#1a5a6d] via-[#39a4bf] via-[#25768a] via-[#8d7fd2] via-[#7c5fb5] via-[#a06bba] via-[#e584b5] to-[#e0718e] bg-clip-text text-transparent inline brightness-110 relative">Manasthali</div>
        </div>
      </div>
      <br /> <br /> <br />
      {/* Content Section */}
      <div className="flex flex-1 w-full mt-[18px]">
        {/* Left Navbar */}
        <div className="w-44 border-r border-gray-300 bg-white hidden md:block">
          <div className="nav-item flex items-center pl-[15px] w-[170px] h-[45px] m-[5px] border-0 rounded-sm" onClick={() => setActiveComponent("home")}>
            <HomeIcon />
            <span className="icon-text ml-2">Home</span>
          </div>
          <div className="nav-item flex items-center pl-[15px] w-[170px] h-[45px] m-[5px] border-0 rounded-sm" onClick={() => setActiveComponent("groups")}>
            <GroupIcon />
            <span className="icon-text ml-2">Group</span>
          </div>
          <div className="nav-item flex items-center pl-[15px] w-[170px] h-[45px] m-[5px] border-0 rounded-sm" onClick={() => setActiveComponent("chat")}>
            <ChatIcon />
            <span className="icon-text ml-2">Chat</span>
          </div>
          <div className="nav-item flex items-center pl-[15px] w-[170px] h-[45px] m-[5px] border-0 rounded-sm" onClick={() => setActiveComponent("group-chat")}>
            <Forum />
            <span className="icon-text ml-2">GroupChat</span>
          </div>
          <div className="nav-item flex items-center pl-[15px] w-[170px] h-[45px] m-[5px] border-0 rounded-sm" onClick={() => setActiveComponent("notifications")}>
            <NotificationsIcon />
            <span className="icon-text ml-2">Notifications</span>
          </div>
          <div className="nav-item flex items-center pl-[15px] w-[170px] h-[45px] m-[5px] border-0 rounded-sm" onClick={() => setActiveComponent("find-friends")}>
            <PersonAddAlt1 />
            <span className="icon-text ml-2">Find-Friends</span>
          </div>
          <div className="nav-item flex items-center pl-[15px] w-[170px] h-[45px] m-[5px] border-0 rounded-sm" onClick={() => setActiveComponent("post")}>
            <AddCircleOutline />
            <span className="icon-text ml-2">Post</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 md:px-16 bg-white text-lg md:text-2xl">
          <div className="bg-white mb-5 overflow-y-scroll">
            {activeComponent === "home" && (
              <div className="bg-white text-black h-20 max-h-[500px] overflow-y-auto border-b border-gray-300">
                <Story />
              </div>
            )}
            {renderActiveComponent()}
          </div>
        </div>

        {/* Right Navbar */}
        <div className="hidden md:block w-24 border-l border-gray-300 bg-white flex flex-col items-center py-4 gap-4 overflow-y-auto">
          <div className="nav-item p-[15px] cursor-pointer border-0 rounded-full text-center" onClick={() => handleProfileClick()}>
            {profileData ? (
              <img src={profileData.profile_picture} alt="user" className="h-[30px] w-[30px] border border-black rounded-full" />
            ) : (
              <img src={defaultProfile} alt="Default User" className="h-[30px] w-[30px] border border-black rounded-full" />
            )}
          </div>
          <div className="nav-item p-[15px] cursor-pointer border-0 rounded-full text-center" onClick={() => setActiveComponent("challenge")}>
            <EventIcon />
          </div>
          <div className="nav-item p-[15px] cursor-pointer border-0 rounded-full text-center" onClick={() => setActiveComponent("mental-coach")}>
            <FaceRetouchingNaturalIcon />
          </div>
          <div className="nav-item p-[15px] cursor-pointer border-0 rounded-full text-center" onClick={() => setActiveComponent("community")}>
            <GroupsIcon />
          </div>
          <div className="nav-item p-[15px] cursor-pointer border-0 rounded-full text-center" onClick={() => setActiveComponent("setting")}>
            <Settings />
          </div>
          <div className="nav-item p-[15px] cursor-pointer border-0 rounded-full text-center" onClick={() => dispatch(signOut())}>
            <PowerSettingsNewIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
