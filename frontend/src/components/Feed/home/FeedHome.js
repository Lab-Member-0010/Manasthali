import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { AiOutlineHeart, AiFillHeart, AiOutlineComment } from "react-icons/ai";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { RiSendPlaneFill } from "react-icons/ri";
import Modal from "react-modal";
import * as styles from "./FeedHome.styles";
import EmojiPicker from 'emoji-picker-react';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import Api from "../../../apis/Api";

Modal.setAppElement('#root');

const FeedHome = () => {
  const [posts, setPosts] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [activeEmojiPicker, setActiveEmojiPicker] = useState(null);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false); 

  const userId = useSelector((state) => state?.user?.user?._id);
  const token = useSelector((state) => state?.user?.token);

  useEffect(() => {
    if (userId && token) {
      axios
        .get(`${Api.GET_COMMUNITY_POST}/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const fetchedPosts = response.data.posts || [];
          const likedPosts = JSON.parse(localStorage.getItem("likedPosts")) || [];
          const updatedPosts = fetchedPosts.map((post) => {
            const likedPost = likedPosts.find((lp) => lp.id === post._id);
            return likedPost ? { ...post, likes: likedPost.likes } : post;
          });
          setPosts(updatedPosts);
        })
        .catch((error) => toast.error(error.response?.data?.message || "Error fetching posts"));
    }
  }, [userId, token]);

  const handleLike = async (post) => {
    try {
      const likeAction = post.likes.includes(userId) ? "unlike" : "like";
      const updatedPosts = posts.map((p) =>
        p._id === post._id
          ? {
            ...p,
            likes: likeAction === "like" ? [...p.likes, userId] : p.likes.filter((id) => id !== userId),
          }
          : p
      );
      setPosts(updatedPosts);

      localStorage.setItem("likedPosts", JSON.stringify(updatedPosts.map((p) => ({ id: p._id, likes: p.likes }))));

      await axios.post(`${Api.BASIC_POST_ROUTE}/${post._id}/${likeAction}`, { userId }, { headers: { Authorization: `Bearer ${token}` } });

      if (likeAction === "like") {
        const notificationData = {
          userId: post.userId,
          notification_type: "like",
          sender_id: userId,
        };
        console.log(notificationData);

        await axios.post(Api.SEND_NOTIFICATION, notificationData, { headers: { Authorization: `Bearer ${token}` } });
      }

    } catch (error) {
      toast.error("Error updating like status");
    }
  };

  const handleCommentPost = async (postId) => {
    const id = postId;
    try {
      const response = await axios.get(`${Api.BASIC_POST_ROUTE}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data.post)
      return response.data.post;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching comments");
    }
  };

  const handleCommentToggle = async (postId) => {
    try {
      const post = await handleCommentPost(postId);
      console.log(post);
      setActiveCommentPost(activeCommentPost === postId ? null : post);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCommentSubmit = async (postId) => {
    if (newComment.trim()) {
      try {
        await axios.post(
          `${Api.ADD_COMMENT}/${postId}`,
          { comment: newComment, userId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const notificationData = {
          userId: postId.userId,
          notification_type: "comment",
          sender_id: userId,  
        };

        await axios.post(Api.SEND_NOTIFICATION, notificationData, { headers: { Authorization: `Bearer ${token}` } });

        toast.success("Comment added successfully");
        setNewComment("");
        setActiveCommentPost(null);

        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p._id === postId ? { ...p, comments: [...p.comments, { user_id: { username: "You" }, comment: newComment }] } : p
          )
        );
      } catch (error) {
        toast.error("Error adding comment");
      }
    }
  };

  const handleEmojiClick = (emojiData) => {
    setNewComment((newComment) => newComment + emojiData.emoji);
    setEmojiPickerVisible(false);
  };

  const toggleEmojiPicker = (postId) => {
    setActiveEmojiPicker(activeEmojiPicker === postId ? null : postId);
  };

  return (
    <div style={styles.feedContainer}>
      <ToastContainer />
      <div className="row">
        {posts.map((post) => (
          <div key={post._id} className="col-md-12" style={styles.postCardContainer}>
            <div className="postCard card">
              <div style={styles.cardHeader}>
                <img src={post?.userId?.profile_picture || "default-profile.jpg"} alt="Profile" style={styles.roundedProfile} />
                <span style={styles.userName}>{post?.userId?.username || "Unknown User"}</span>
              </div>
              <div className="card-body cardBody">
                <p style={styles.postDescription}>{post.description}</p>
                {post.media?.[0] && <img src={post.media[0]} alt="Post" style={styles.postImage} />}
                <div style={styles.likeCommentShareButton}>
                  <button style={styles.likeButton} onClick={() => handleLike(post)}>
                    {post.likes.includes(userId) ? <AiFillHeart size={24} color="red" /> : <AiOutlineHeart size={24} color="black" />}
                  </button>
                  <span style={styles.likeCount}>{post.likes.length} Likes</span>
                  <button style={styles.commentButton} onClick={() => handleCommentToggle(post._id)}>
                    <AiOutlineComment size={26} color="black" />
                  </button>
                  <span style={styles.commentCount}>{post.comments.length} Comments</span>
                  <button style={styles.shareButton}>
                    <RiSendPlaneFill size={24} color="black" />
                  </button>
                  <span style={styles.shareCount}>Share</span>
                </div>
                <div style={styles.commentTextbox}>
                  <button style={styles.emojiButton} onClick={() => toggleEmojiPicker(post._id)}>
                    <EmojiEmotionsOutlinedIcon/>
                  </button>

                  {activeEmojiPicker === post._id && (
                    <div style={styles.emojiPickerContainer}>
                      <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>
                  )}
                  <input
                    type="text"
                    style={styles.commentTextField}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                  />
                  <span><button style={styles.commentPostButton} onClick={() => handleCommentSubmit(post._id)} disabled={!newComment}>Post</button></span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Commenting */}

      <Modal
        isOpen={activeCommentPost !== null}
        onRequestClose={() => setActiveCommentPost(null)}
        contentLabel="Add Comment"
        style={{ content: styles.modalContent, overlay: styles.modalOverlay }}
      >
        <div style={styles.postMedia}>
          {activeCommentPost?.media?.[0] && (
            <img src={activeCommentPost.media[0]} alt="Post" style={styles.modalPostImage} />
          )}
        </div>
        <div style={styles.postComments}>
          <div style={styles.closeButton}>
            <button style={styles.closeModalButton} onClick={() => setActiveCommentPost(null)}>X</button>
          </div>
          <div style={styles.postCommentsInnerDiv}>

          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FeedHome;

