import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import defaultProfile from "@assets/default_profile.jpg";


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

      if (response.status === 200 || response.status === 201) {
        setStory(response.data.story || response.data);
      }
    } catch (error) {
      console.error("Error uploading story");
    }
  };

  const handleDeleteStory = async () => {
    if (!story?._id) return;
    try {
      await axios.delete(`${BASE_URL}/story/stories/${story._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStory(null);
      setShowStory(false);
    } catch (error) {
      console.error("Error deleting story");
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
        role="button"
        tabIndex={0}
        aria-label={story ? "View your story" : "Add a story"}
        className={`w-[60px] h-[60px] rounded-full bg-[#3498db] flex items-center justify-center overflow-hidden ${story ? "border-2 border-red-500" : ""}`}
        onClick={handleProfileClick}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleProfileClick(); }}
      >
        <img
          src={user?.profile_picture ? user.profile_picture : defaultProfile}
          alt={user?.username ? `${user.username}'s profile` : "Profile"}
          className="w-full h-full object-cover rounded-full"
        />
      </div>

       
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

     
      {showStory && story && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[999]">
          <img src={getMediaUrl(story.media)} alt="Your story" className="max-w-[90%] max-h-[90%]" onClick={() => setShowStory(false)} />
          <button
            onClick={handleDeleteStory}
            aria-label="Delete story"
            className="fixed top-5 right-20 bg-red-500/80 text-white border-none rounded p-2 cursor-pointer z-50"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default Story;

 