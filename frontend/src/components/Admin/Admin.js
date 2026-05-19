import * as styles from "./Admin.styles";
import ManasthaliLogo from "../../images/Manasthali.png";
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
    <div style={styles.adminContainer}>
        <div style={styles.headerAdmin}>
            <div style={styles.headerLeftAdmin}>
                <img style={styles.rotatingLogoAdmin} src={ManasthaliLogo} alt="Manasthali Logo" width={70} height={70} />
                <div style={styles.siteLogoAdmin}>Manasthali</div>
            </div>
        </div>

        <br /> <br /> <br />

        <div style={styles.contentContainerAdmin}>

            <div style={styles.leftNavbarAdmin}>
                <div className="nav-item" style={styles.navItemAdmin} onClick={() => setActiveComponent("home")}>
                    <HomeIcon />
                    <span className="icon-text ml-2">Admin</span>
                </div>
                <div className="nav-item" style={styles.navItemAdmin} onClick={() => setActiveComponent("group")}>
                    <GroupIcon />
                    <span className="icon-text ml-2">Add Group</span>
                </div>
            </div>

            <div style={styles.midPartAdmin}>
                <div style={styles.innerDbAdmin}>
                {renderActiveComponent()}
                </div>
            </div>

        </div>
    </div>
  );
};

export default Admin;


