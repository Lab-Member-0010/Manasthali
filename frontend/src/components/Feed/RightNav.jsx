import React from "react";
import {
  Event as EventIcon,
  Groups as GroupsIcon,
  PowerSettingsNew as PowerSettingsNewIcon,
  Settings,
} from "@mui/icons-material";
import FaceRetouchingNaturalIcon from "@mui/icons-material/FaceRetouchingNatural";
import defaultProfile from "@assets/default_profile.jpg";

const iconButtons = [
  { key: "challenge", icon: <EventIcon />, label: "Challenges" },
  { key: "mental-coach", icon: <FaceRetouchingNaturalIcon />, label: "Mental Coach" },
  { key: "community", icon: <GroupsIcon />, label: "Community" },
  { key: "setting", icon: <Settings />, label: "Settings" },
];

const RightNav = ({ profileData, onProfileClick, setActiveComponent, onSignOut }) => {
  return (
    <div className="hidden md:block w-24 border-l border-gray-300 bg-white flex flex-col items-center py-4 gap-4 overflow-y-auto">
      <div
        role="button"
        tabIndex={0}
        aria-label="Profile"
        className="nav-item p-[15px] cursor-pointer border-0 rounded-full text-center"
        onClick={onProfileClick}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onProfileClick(); }}
      >
        {profileData ? (
          <img src={profileData.profile_picture} alt="user" className="h-[30px] w-[30px] border border-black rounded-full" />
        ) : (
          <img src={defaultProfile} alt="Default User" className="h-[30px] w-[30px] border border-black rounded-full" />
        )}
      </div>
      {iconButtons.map((item) => (
        <div
          key={item.key}
          role="button"
          tabIndex={0}
          aria-label={item.label}
          className="nav-item p-[15px] cursor-pointer border-0 rounded-full text-center"
          onClick={() => setActiveComponent(item.key)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setActiveComponent(item.key); }}
        >
          {item.icon}
        </div>
      ))}
      <div
        role="button"
        tabIndex={0}
        aria-label="Sign Out"
        className="nav-item p-[15px] cursor-pointer border-0 rounded-full text-center"
        onClick={onSignOut}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onSignOut(); }}
      >
        <PowerSettingsNewIcon />
      </div>
    </div>
  );
};

export default RightNav;
