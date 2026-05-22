import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Api from '../../../apis/Api';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-bootstrap';

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
const styles = {
container: {
  marginBottom: '80px',
  padding: '20px',
},
  cardsContainer: {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '20px',
  padding: '20px',
  margin: '0px auto',
  maxWidth: '1200px',
},
  card: {
  backgroundColor: '#f9f9f9',
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  padding: '20px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
},
  personalityImage: {
  height: '100px',
  width: '120px',
}
};

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
