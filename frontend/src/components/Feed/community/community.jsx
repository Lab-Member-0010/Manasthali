import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Api from '../../../apis/Api';
import { toast, ToastContainer } from 'react-toastify';

// Importing all the personality images
import INFJ from "@assets/community/infj.png";
import ISFJ from "@assets/community/isfj.png";
import INFP from "@assets/community/infp.png";
import INTJ from "@assets/community/intj.png";
import INTP from "@assets/community/intp.png";
import ISFP from "@assets/community/isfp.png";
import ISTJ from "@assets/community/istj.png";
import ISTP from "@assets/community/istp.png";
import ENFJ from "@assets/community/enfj.png";
import ESFJ from "@assets/community/esfj.png";
import ENFP from "@assets/community/enfp.png";
import ENTJ from "@assets/community/entj.png";
import ENTP from "@assets/community/entp.png";
import ESFP from "@assets/community/esfp.png";
import ESTJ from "@assets/community/estj.png";
import ESTP from "@assets/community/estp.png";

const Community = () => {
  const [personalityData, setPersonalityData] = useState([]);
  const { token } = useSelector((store) => store.user);

  // Mapping personality types to their image imports
  const personalityImages = {
    INFJ,
    ISFJ,
    INFP,
    INTJ,
    INTP,
    ISFP,
    ISTJ,
    ISTP,
    ENFJ,
    ESFJ,
    ENFP,
    ENTJ,
    ENTP,
    ESFP,
    ESTJ,
    ESTP
  };

  useEffect(() => {
    const fetchPersonalityData = async () => {
      try {
        const response = await axios.get(Api.COMMUNITY_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data);
        setPersonalityData(Array.isArray(response.data.data) ? response.data.data : []);
      } catch (err) {
        toast.error("No Community found!");
      }
    };

    fetchPersonalityData();
  }, [token]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <ToastContainer />
      <h1 className='text-center text-gray-900'>Communities</h1>
      <div className="grid grid-cols-4 gap-5 p-5 mx-auto max-w-6xl">
        {personalityData.map((personality) => {
          // Dynamically assign the image based on personality_type
          const image = personalityImages[personality.personality_type];

          return (
            <div key={personality._id} className="bg-white rounded-lg shadow p-6 mb-4">
              {/* Render image if it exists */}
              {image ? (
                <center><img src={image} alt={personality.personality_type} className="w-24 h-24 rounded-full object-cover"/></center>
              ) : (
                <p>No image available</p>
              )}
              <h2>{personality.name}</h2>
              <p>{personality.description}</p>
              <p><strong>Personality Type:</strong> {personality.personality_type}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Community;
