import React, { useState } from "react";
import axios from "axios";
import { useDispatch,useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as styles from "./ProfileSetting.styles";
import { signOut } from "../../../redux-config/UserSlice";

const BASE_URL = import.meta.env.VITE_API_URL;


const ProfileSetting= () => {
  const user = useSelector((state) => state.user?.user);
  const userId = useSelector((state) => state.user.user._id);
  const token=useSelector((state) => state.user.token);
  const [profilePicture, setProfilePicture] = useState(null);
  const [contact, setContact] = useState(user?.contact || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [dob, setDob] = useState(user?.dob || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [Delete, setDelete] = useState(user?.delete || "");
  const [message, setMessage] = useState("");
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const dispatch = useDispatch();

  const handleProfilePictureUpdate = async (e) => {
    e.preventDefault();

    if (!profilePicture) {
      toast.error("Please select a profile picture.");
      return;
    }

    const formData = new FormData();
    formData.append("profile_picture", profilePicture);

    try {
      const response = await axios.put(
        `${BASE_URL}/users/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setMessage("Profile picture updated successfully!");
        toast.success("Profile picture updated successfully!");
      } else {
        toast.error("Failed to update profile picture.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile picture.");
    }
  };

  const handleContactUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${BASE_URL}/users/${userId}/contact`,
        { contact },
        {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        }
      );
      if (response.data.success) {
        toast.success("Contact updated successfully!");
        setMessage("Contact updated successfully!");
      } else {
        toast.error("Failed to update Contact.");
        setMessage("Failed to update contact. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to update Contact.");
      setMessage("Failed to update contact. Please try again.");
    }
  };
  
  // Handle DOB update
  const handleDobUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${BASE_URL}/users/${userId}/dob`,
        { dob },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (response.data.success) {
        toast.success("DOB updated successfully!");
        setMessage("Date of Birth updated successfully!");
      } else {
        toast.error("Failed to update DOB.");
        setMessage("Failed to update DOB. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to update DOB.");
      setMessage("Failed to update DOB. Please try again.");
    }
  };
  
  // Handle gender update
  const handleGenderUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${BASE_URL}/users/${userId}/gender`,
        { gender },
        {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        }
      );
  
      if (response.data.success) {
        toast.success("Gender updated successfully!");
        setMessage("Gender updated successfully!");
      } else {
        toast.error("Failed to update Gender.");
        setMessage("Failed to update gender. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to update Gender.");
      setMessage("Failed to update gender. Please try again.");
    }
  };
  
  const handleBioUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${BASE_URL}/users/${userId}/bio`,
        { bio },
        {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        }
      );
      if (response.data.success) {
        toast.success("Bio updated successfully!");
        setMessage("Bio updated successfully!");
      } else {
        toast.error("Failed to update Bio.");
        setMessage("Failed to update Bio. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to update Bio.");
      setMessage("Failed to update Bio. Please try again.");
    }
  };

  const handleUserDelete = async (e)=>{
    e.preventDefault();
    try {
      const response = await axios.delete(
        `${BASE_URL}/users/${userId}/delete`,
        {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        }
      );
        toast.success("User Deleted successfully!");
        setMessage("User Deleted successfully!");
        dispatch(signOut());
    }catch(err){
      toast.error("Failed to Delete User.2");
      setMessage("Failed to Delete User. Please try again.");
    }
  };
  
  return (
    <div className="container py-4">
      <ToastContainer />
      
      <div>
          <h2 className="text-center text-dark mb-4">Your Profile</h2>
      </div>

      {!showUpdateForm && (
        <div className="text-center mt-4">
          <button
            className="form-control w-100"
            style={styles.updateProfile}
            onClick={() => setShowUpdateForm(true)}
          >
            Update Your Details
          </button>
        </div>
      )}

      {showUpdateForm && (
        <div className="row mt-4">
          <div className="col-md-4 mb-2">
            <div className="card shadow-sm" style={styles.divSize}>
              <div className="card-body">
                <h5 className="card-title">Update Profile Picture</h5>
                <form onSubmit={handleProfilePictureUpdate}>
                  <input
                    type="file"
                    className="form-control mb-2"
                    accept="image/*"
                    onChange={(e) => setProfilePicture(e.target.files[0])}
                    required
                  />
                  <button className="form-control" style={styles.updateProfile} type="submit">
                    Update Picture
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-2">
            <div className="card shadow-sm" style={styles.divSize}>
              <div className="card-body">
                <h5 className="card-title">Update Contact</h5>
                <form onSubmit={handleContactUpdate}>
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Enter new contact"
                    required
                  />
                  <button className="form-control" style={styles.updateProfile} type="submit">
                    Update Contact
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-2">
            <div className="card shadow-sm" style={styles.divSize}>
              <div className="card-body">
                <h5 className="card-title">Update Date of Birth</h5>
                <form onSubmit={handleDobUpdate}>
                  <input
                    type="date"
                    className="form-control mb-2 abc"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                  />
                  <button className="form-control" style={styles.updateProfile} type="submit">
                    Update DOB
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-2">
            <div className="card shadow-sm" style={styles.divSize}>
              <div className="card-body">
                <h5 className="card-title">Update Gender</h5>
                <form onSubmit={handleGenderUpdate}>
                  <select
                    className="form-select mb-2"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <button className="form-control" style={styles.updateProfile} type="submit">
                    Update Gender
                  </button>
                </form>
              </div>
            </div>
          </div>


          <div className="col-md-4 mb-2">
            <div className="card shadow-sm" style={styles.divSize}>
              <div className="card-body">
                <h5 className="card-title">Update Bio</h5>
                <form onSubmit={handleBioUpdate}>
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Enter new Bio"
                    required
                  />
                  <button className="form-control" style={styles.updateProfile} type="submit">
                    Update Bio
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-2">
            <div className="card shadow-sm" style={styles.divSize}>
              <div className="card-body">
                <h5 className="card-title">Delete User</h5>
                <form onSubmit={handleUserDelete}>
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={Delete}
                    onChange={(e) => setDelete(e.target.value)}
                    placeholder="Enter yes to delete"
                    required
                  />
                  <button className="form-control" style={styles.updateProfile} type="submit">
                    Delete User
                  </button>
                </form>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default ProfileSetting;