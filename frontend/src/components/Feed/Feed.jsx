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
const styles = {
mainContainer: {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  overflow: 'hidden',
},
  contentContainer: {
  display: 'flex',
  flex: 1,
  width: '100%',
  marginTop: '18px',
},
  leftNavbar: {
  width: '180px',
  borderRight: '1px solid lightgrey',
  backgroundColor: 'white',
},
  navItem: {
  border: '0px solid black',
  borderRadius: '2px',
  width: '170px',
  height: '45px',
  margin: '5px',
  padding: '0px',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  paddingLeft: '15px',
},
  rightNavbar: {
  width: '100px',
  height: '100%',
  backgroundColor: 'white',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'start',
  borderLeft: '1px solid lightgray',
  overflowY: 'auto',
},
  navItems: {
  padding: '15px',
  cursor: 'pointer',
  border: '0px',
  borderRadius: '50%',
  textAlign: 'center',
},
  midPart: {
  backgroundColor: 'white',
  flex: 1,
  color: 'white',
  fontSize: '24px',
  overflowY: 'auto',
  overflowX: 'hidden',
  paddingLeft: '70px',
  paddingRight: '70px',
},
  innerDb: {
  backgroundColor: 'white',
  height: 'calc(100vh - 100px)',
  overflowY: 'scroll',
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  marginBottom: '20px',
},
  storiesDiv: {
  backgroundColor: 'white',
  color: 'black',
  height: '80px',
  maxHeight: '500px',
  overflowY: 'auto',
  msOverflowStyle: 'none',
  borderBottom: '1px solid lightgray',
},
  header: {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 20px',
  backgroundColor: 'white',
  borderBottom: '0px solid #ddd',
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
},
  headerLeft: {
  display: 'flex',
  alignItems: 'center',
},
  menuButton: {
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
},
  rotatingLogo: {
  animation: 'animate 5s infinite ease-in-out',
},
  profileIcon: {
  height: '30px',
  width: '30px',
  border: '1px solid black',
  borderRadius: '50%',
},
  siteLogo: {
  fontSize: '40px',
  fontWeight: 'bold',
  background: 'linear-gradient(45deg, #1a5a6d, #39a4bf, #25768a, #8d7fd2, #7c5fb5, #a06bba, #e584b5, #e0718e)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  color: 'transparent',
  display: 'inline',
  filter: 'brightness(1.2)',
  animation: 'fallIn 1.5s ease-in-out',
  position: 'relative',
}
};

const BASE_URL = import.meta.env.VITE_API_URL;

const Feed = () => {
  const { token } = useSelector((store) => store.user);
  const userId = useSelector((state) => state.user.user._id);
  const dispatch = useDispatch();

  const [activeComponent, setActiveComponent] = useState("home");
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [feedRefreshKey, setFeedRefreshKey] = useState(0);

  const handlePostCreated = () => {
    setFeedRefreshKey((k) => k + 1);
    setActiveComponent("home");
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
