import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import defaultProfile from "@assets/default_profile.jpg";
const styles = {
circle: {
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  backgroundColor: '#3498db',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
},
  activeStory: {
  borderColor: 'red',
},
  profileImage: {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: '50%',
},
  storyViewer: {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0, 0, 0, 0.9)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 999,
}
};

const BASE_URL = import.meta.env.VITE_API_URL;

const Story = () => {
  const fileInputRef = useRef(null);
  const user = useSelector((state) => state.user?.user);
  const token = useSelector((state) => state.user?.token);
  const [story, setStory] = useState(null);
  const [showStory, setShowStory] = useState(false);

  
  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/story/stories/user/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
             
        if (response.data && response.data.length > 0) {
          setStory(response.data[0]);
        }
      } catch (error) {
        console.error("Error fetching story", error);
      }
    };
    if (user?._id && token) {
      fetchStory();
    }
  }, [user?._id, token]);

   
  const handleProfileClick = () => {
    if (story) {
      setShowStory(true);
    } else {
      fileInputRef.current.click();
    }
  };

 
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("media", file);

    try {
      const response = await axios.post(`${BASE_URL}/story/stories`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        setStory(response.data);
      }
    } catch (error) {
      console.error("Error uploading story");
    }
  };

  // Determine the correct media URL — S3/Cloudinary URLs are absolute, local paths need BASE_URL prefix
  const getMediaUrl = (media) => {
    if (!media) return "";
    const mediaStr = Array.isArray(media) ? media[0] : media;
    if (!mediaStr) return "";
    if (mediaStr.startsWith("http")) return mediaStr;
    return `${BASE_URL}/${mediaStr}`;
  };

  return (
    <div>
     
      <div
        style={story ? {...styles.circle, ...styles.activeStory} : styles.circle}
        onClick={handleProfileClick}
      >
        <img
          src={user?.profile_picture ? user.profile_picture : defaultProfile}
          alt="Profile"
          style={styles.profileImage}
        />
      </div>

       
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

     
      {showStory && story && (
        <div style={styles.storyViewer} onClick={() => setShowStory(false)}>
          <img src={getMediaUrl(story.media)} alt="Story" />
        </div>
      )}
    </div>
  );
};

export default Story;

 