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
import * as styles from "./Feed.styles";
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
        return <FeedHome />;
      case "groups":
        return <Group />;
      case "chat":
        return <Chat />;
      case "group-chat":
        return <GroupChat />;
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
        return <Post />;
      case "setting":
        return <ProfileSetting />;
      case "community":
        return <Community />;
      default:
        return <FeedHome />;
    }
  };

  return (
    <div style={styles.mainContainer}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <img style={styles.rotatingLogo} src={ManasthaliLogo} alt="Manasthali Logo" width={70} height={70} />
          <div style={styles.siteLogo}>Manasthali</div>
        </div>
      </div>
      <br /> <br /> <br />
      {/* Content Section */}
      <div style={styles.contentContainer}>
        {/* Left Navbar */}
        <div style={styles.leftNavbar}>
          <div className="nav-item" style={styles.navItem} onClick={() => setActiveComponent("home")}>
            <HomeIcon />
            <span className="icon-text ml-2">Home</span>
          </div>
          <div className="nav-item" style={styles.navItem} onClick={() => setActiveComponent("groups")}>
            <GroupIcon />
            <span className="icon-text ml-2">Group</span>
          </div>
          <div className="nav-item" style={styles.navItem} onClick={() => setActiveComponent("chat")}>
            <ChatIcon />
            <span className="icon-text ml-2">Chat</span>
          </div>
          <div className="nav-item" style={styles.navItem} onClick={() => setActiveComponent("group-chat")}>
            <Forum />
            <span className="icon-text ml-2">GroupChat</span>
          </div>
          <div className="nav-item" style={styles.navItem} onClick={() => setActiveComponent("notifications")}>
            <NotificationsIcon />
            <span className="icon-text ml-2">Notifications</span>
          </div>
          <div className="nav-item" style={styles.navItem} onClick={() => setActiveComponent("find-friends")}>
            <PersonAddAlt1 />
            <span className="icon-text ml-2">Find-Friends</span>
          </div>
          <div className="nav-item" style={styles.navItem} onClick={() => setActiveComponent("post")}>
            <AddCircleOutline />
            <span className="icon-text ml-2">Post</span>
          </div>
        </div>

        {/* Main Content */}
        <div style={styles.midPart}>
          <div style={styles.innerDb}>
            {activeComponent === "home" && (
              <div style={styles.storiesDiv}>
                <Story />
              </div>
            )}
            {renderActiveComponent()}
          </div>
        </div>

        {/* Right Navbar */}
        <div style={styles.rightNavbar}>
          <div className="nav-item" style={styles.navItems} onClick={() => handleProfileClick()}>
            {profileData ? (
              <img src={profileData.profile_picture} alt="user" style={styles.profileIcon} />
            ) : (
              <img src={defaultProfile} alt="Default User" style={styles.profileIcon} />
            )}
          </div>
          <div className="nav-item" style={styles.navItems} onClick={() => setActiveComponent("challenge")}>
            <EventIcon />
          </div>
          <div className="nav-item" style={styles.navItems} onClick={() => setActiveComponent("mental-coach")}>
            <FaceRetouchingNaturalIcon />
          </div>
          <div className="nav-item" style={styles.navItems} onClick={() => setActiveComponent("community")}>
            <GroupsIcon />
          </div>
          <div className="nav-item" style={styles.navItems} onClick={() => setActiveComponent("setting")}>
            <Settings />
          </div>
          <div className="nav-item" style={styles.navItems} onClick={() => dispatch(signOut())}>
            <PowerSettingsNewIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
