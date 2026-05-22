import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import Api from "../../../apis/Api";
const styles = {
container: {
  padding: '20px',
},
  createPost: {
  border: 'none',
  padding: '0.5rem 1.5rem',
  fontSize: '1.25rem',
  borderRadius: '10px',
  backgroundColor: '#c093fc',
  color: 'white',
  transition: 'transform 0.3s ease, background-color 0.3s ease',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
}
};

const Post = ({ onPostCreated }) => {
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState([]);
  const userId = useSelector((state) => state.user.user._id);
  const token = useSelector((state) => state.user.token);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("description", description);
    Array.from(media).forEach((file) => formData.append("media", file));

    try {
      const response = await axios.post(
        Api.BASIC_POST_ROUTE,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201) {
        toast.success("Post created successfully");
        setDescription("");
        setMedia([]);
        if (onPostCreated) onPostCreated();
      } else {
        toast.error("Error creating post");
      }
    } catch (error) {
      toast.error("Error creating post");
    }
  };

  return (
    <div className="mt-5 border card" style={styles.container}>
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <div>
          <center><h1 className="text-dark mb-3">Create Post</h1></center>
        </div>
        <div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a description..."
            className="form-control mb-3"
          />
        </div>
        <div>                   
          <input
            type="file"
            multiple
            onChange={(e) => setMedia(e.target.files)}
            className="form-control mb-3"
          />
        </div>
        <div>
          <button type="submit" className="form-control mb-3" style={styles.createPost}>Create Post</button>
        </div>
      </form>
    </div>
  );
};

export default Post;
