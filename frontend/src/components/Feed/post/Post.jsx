import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import Api from "../../../apis/Api";


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
    <div className="mt-5 border border-gray-200 rounded-lg p-5">
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <div>
          <center><h1 className="text-gray-900 mb-3">Create Post</h1></center>
        </div>
        <div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a description..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-3"
            aria-label="Post description"
          />
        </div>
        <div>                   
          <input
            type="file"
            multiple
            onChange={(e) => setMedia(e.target.files)}
            className="w-full mb-3"
            aria-label="Upload media files"
          />
        </div>
        <div>
          <button type="submit" className="w-full mb-3 border-none py-2 px-6 text-xl rounded-lg bg-[#c093fc] text-white shadow-md transition-transform duration-300 ease-in-out">Create Post</button>
        </div>
      </form>
    </div>
  );
};

export default Post;
