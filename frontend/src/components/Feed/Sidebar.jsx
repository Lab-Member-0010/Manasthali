import React from "react";
import {
  Home as HomeIcon,
  AddCircleOutline,
  PersonAddAlt1,
  Forum,
  Group as GroupIcon,
  Chat as ChatIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";

const navItems = [
  { key: "home", icon: <HomeIcon />, label: "Home" },
  { key: "groups", icon: <GroupIcon />, label: "Group" },
  { key: "chat", icon: <ChatIcon />, label: "Chat" },
  { key: "group-chat", icon: <Forum />, label: "GroupChat" },
  { key: "notifications", icon: <NotificationsIcon />, label: "Notifications" },
  { key: "find-friends", icon: <PersonAddAlt1 />, label: "Find-Friends" },
  { key: "post", icon: <AddCircleOutline />, label: "Post" },
];

const Sidebar = ({ activeComponent, setActiveComponent }) => {
  return (
    <div className="w-44 border-r border-gray-300 bg-white hidden md:block">
      {navItems.map((item) => (
        <div
          key={item.key}
          role="button"
          tabIndex={0}
          aria-label={item.label}
          className={`nav-item flex items-center pl-[15px] w-[170px] h-[45px] m-[5px] border-0 rounded-sm cursor-pointer ${activeComponent === item.key ? "bg-purple-100" : ""}`}
          onClick={() => setActiveComponent(item.key)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setActiveComponent(item.key); }}
        >
          {item.icon}
          <span className="icon-text ml-2">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default React.memo(Sidebar);
