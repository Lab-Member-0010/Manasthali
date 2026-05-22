import React, { useState } from 'react';
import axios from 'axios';
import Api from '../../../apis/Api';
import { ToastContainer, toast } from "react-toastify";

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
      const response = await axios.post(Api.CREATE_GROUP, {
        personality_type,
        name,
        description
      });

      if (response.status === 201) {
        toast.success('Group created successfully!');
      }
    } catch (error) {
      toast.error('Error creating group. Please try again.');
    }
  };

  return (
    <div className="mt-5 border card p-5 max-w-[600px] mx-auto">
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
        <button type="submit" className="form-control mb-3 bg-blue-600 text-white border-none p-2.5 rounded cursor-pointer">Create Group</button>
      </form>
    </div>
  );
};

export default Groups;
