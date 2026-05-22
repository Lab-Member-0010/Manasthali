import React, { useState } from 'react';
import axios from 'axios';
import Api from '../../../apis/Api';
import { ToastContainer, toast } from "react-toastify";
const styles = {
  container: { padding: '20px', maxWidth: '600px', margin: '0 auto' },
  createGroup: { backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer' },
};

const personality_types = {
  INFJ: "INFJ",
  ISFJ: "ISFJ",
  INFP: "INFP",
  INTJ: "INTJ",
  INTP: "INTP",
  ISFP: "ISFP",
  ISTJ: "ISTJ",
  ISTP: "ISTP",
  ENFJ: "ENFJ",
  ESFJ: "ESFJ",
  ENFP: "ENFP",
  ENTJ: "ENTJ",
  ENTP: "ENTP",
  ESFP: "ESFP",
  ESTJ: "ESTJ",
  ESTP: "ESTP"
};

const Groups = () => {
  const [formData, setFormData] = useState({
    personality_type: '',
    name: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { personality_type, name, description } = formData;

    try {
      // Call the API to create the group
      const response = await axios.post(Api.CREATE_GROUP, {
        personality_type,
        name,
        description
      });

      if (response.status === 201) {
        // Toast success message on successful creation
        toast.success('Group created successfully!');
      }
    } catch (error) {
      // Toast error message on failure
      toast.error('Error creating group. Please try again.');
    }
  };

  return (
    <div className="mt-5 border card" style={styles.container}>
        <ToastContainer/>
      <form onSubmit={handleSubmit}>
      <div>
          <center><h1 className="text-dark mb-3">Create Group</h1></center>
        </div>
        <div>
          <label>Personality Type:</label>
          <select
            name="personality_type"
            value={formData.personality_type}
            onChange={handleChange}
            className="form-control mb-3"
            required
          >
            <option value="">Select Personality Type</option>
            {Object.keys(personality_types).map((key) => (
              <option key={key} value={key}>
                {personality_types[key]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Group Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-control mb-3"
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-control mb-3"
            required
          />
        </div>
        <button type="submit" className="form-control mb-3" style={styles.createGroup}>Create Group</button>
      </form>
    </div>
  );
};

export default Groups;
