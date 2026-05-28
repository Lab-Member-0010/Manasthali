import ManasthaliLogo from "@assets/Manasthali.png";
import {
    Home as HomeIcon,
    Group as GroupIcon,
} from "@mui/icons-material";
import { useState } from "react";
import CommunityAdmin from "./Community/communityAdmin";
import Groups from "./Groups/Groups";

const Admin = () => {

    const [activeComponent, setActiveComponent] = useState("admin");

    const renderActiveComponent = () => {
        switch (activeComponent) {
            case "home":
                return <CommunityAdmin />;
            case "group":
                return <Groups />;
            default:
                return <CommunityAdmin />;
        }
      };

    return (
    <div className="flex flex-col h-screen overflow-hidden">
        <div className="flex justify-between items-center px-5 py-2.5 bg-white fixed top-0 left-0 right-0 z-50">
            <div className="flex items-center">
                <img className="animate-rotate-logo" src={ManasthaliLogo} alt="Manasthali Logo" width={70} height={70} />
                <div className="animate-fall-in">Manasthali</div>
            </div>
        </div>

        <br /> <br /> <br />

        <div className="flex flex-1 w-full mt-[18px]">

            <div className="w-[180px] border-r border-gray-300 bg-white">
                <div className="border-0 rounded-[2px] w-[170px] h-[45px] m-1 p-0 flex justify-start items-center pl-4" onClick={() => setActiveComponent("home")}>
                    <HomeIcon />
                    <span className="icon-text ml-2">Admin</span>
                </div>
                <div className="border-0 rounded-[2px] w-[170px] h-[45px] m-1 p-0 flex justify-start items-center pl-4" onClick={() => setActiveComponent("group")}>
                    <GroupIcon />
                    <span className="icon-text ml-2">Add Group</span>
                </div>
            </div>

            <div className="bg-white flex-1 text-white text-2xl overflow-y-auto overflow-x-hidden px-[70px]">
                <div className="bg-white h-[calc(100vh-100px)] overflow-y-scroll mb-5">
                {renderActiveComponent()}
                </div>
            </div>

        </div>
    </div>
  );
};

export default Admin;
