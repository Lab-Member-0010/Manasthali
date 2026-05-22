import ManasthaliLogo from "@assets/Manasthali.png";
import {
    Home as HomeIcon,
    Group as GroupIcon,
} from "@mui/icons-material";
import { useState } from "react";
import CommunityAdmin from "./Community/communityAdmin";
import Groups from "./Groups/Groups";
const styles = {
adminContainer: {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  overflow: 'hidden',
},
  headerAdmin: {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 20px',
  backgroundColor: 'white',
  borderBottom: '0px solid #ddd',
  position: 'fixed',
  top: '0',
  left: '0',
  right: '0',
  zIndex: 1000,
},
  headerLeftAdmin: {
  display: 'flex',
  alignItems: 'center',
},
  rotatingLogoAdmin: {
},
  siteLogoAdmin: {
  fontSize: '40px',
  fontWeight: 'bold',
  background: 'linear-gradient(45deg, #1a5a6d, #39a4bf, #25768a, #8d7fd2, #7c5fb5, #a06bba, #e584b5, #e0718e)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  color: 'transparent',
  display: 'inline',
  filter: 'brightness(1.2)',
  position: 'relative',
},
  contentContainerAdmin: {
  display: 'flex',
  flex: 1,
  width: '100%',
  marginTop: '18px',
},
  leftNavbarAdmin: {
  width: '180px',
  borderRight: '1px solid lightgrey',
  backgroundColor: 'white',
},
  navItemAdmin: {
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
  midPartAdmin: {
  backgroundColor: 'white',
  flex: 1,
  color: 'white',
  fontSize: '24px',
  overflowY: 'auto',
  overflowX: 'hidden',
  paddingLeft: '70px',
  paddingRight: '70px',
},
  innerDbAdmin: {
  backgroundColor: 'white',
  height: 'calc(100vh - 100px)',
  overflowY: 'scroll',
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  marginBottom: '20px',
}
};

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

