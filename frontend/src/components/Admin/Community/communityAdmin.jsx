import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Api from '../../../apis/Api';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

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

const CommunityAdmin = () => {
  const [personalityData, setPersonalityData] = useState([]);
  const navigate = useNavigate();

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
      const adminToken = localStorage.getItem("adminToken");
      if (!adminToken) {
        navigate("/admin-login");
        return;
      }
      try {
        const response = await axios.get(Api.COMMUNITY_GET_URL, {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        setPersonalityData(Array.isArray(response.data.data) ? response.data.data : []);
      } catch (err) {
        toast.error("No Community found!");
      }
    };
    fetchPersonalityData();
  }, [navigate]);

  return (
    <div className="mb-20 p-5">
      <ToastContainer />
      <h1 className='text-center text-dark'>Communities</h1>
      <div className="grid grid-cols-4 gap-5 p-5 mx-auto max-w-[1200px]">
        {personalityData.map((personality) => {
          const image = personalityImages[personality.personality_type];

          return (
            <div key={personality._id} className="bg-[#f9f9f9] border border-gray-200 rounded-lg p-5 shadow-lg">
              {image ? (
                <center><img src={image} alt={personality.personality_type} className="h-[100px] w-[120px]"/></center>
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

export default CommunityAdmin;
