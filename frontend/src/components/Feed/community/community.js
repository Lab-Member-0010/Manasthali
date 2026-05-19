import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Api from '../../../apis/Api';
import * as styles from "./community.styles";
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-bootstrap';

// Importing all the personality images
import INFJ from "../../../images/community/infj.png";
import ISFJ from "../../../images/community/isfj.png";
import INFP from "../../../images/community/infp.png";
import INTJ from "../../../images/community/intj.png";
import INTP from "../../../images/community/intp.png";
import ISFP from "../../../images/community/isfp.png";
import ISTJ from "../../../images/community/istj.png";
import ISTP from "../../../images/community/istp.png";
import ENFJ from "../../../images/community/enfj.png";
import ESFJ from "../../../images/community/esfj.png";
import ENFP from "../../../images/community/enfp.png";
import ENTJ from "../../../images/community/entj.png";
import ENTP from "../../../images/community/entp.png";
import ESFP from "../../../images/community/esfp.png";
import ESTJ from "../../../images/community/estj.png";
import ESTP from "../../../images/community/estp.png";

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
    <div style={styles.container}>
      <ToastContainer />
      <h1 className='text-center text-dark'>Communities</h1>
      <div style={styles.cardsContainer}>
        {personalityData.map((personality) => {
          // Dynamically assign the image based on personality_type
          const image = personalityImages[personality.personality_type];

          return (
            <div key={personality._id} style={styles.card}>
              {/* Render image if it exists */}
              {image ? (
                <center><img src={image} alt={personality.personality_type} style={styles.personalityImage}/></center>
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
