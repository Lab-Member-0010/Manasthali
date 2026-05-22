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

const FeedHome = ({ refreshKey }) => {
  const [posts, setPosts] = useState([]);
  // Per-post comment state, keyed by post ID — prevents one input controlling every post
  const [comments, setComments] = useState({});
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [activeEmojiPicker, setActiveEmojiPicker] = useState(null);

  const userId = useSelector((state) => state?.user?.user?._id);
  const token = useSelector((state) => state?.user?.token);

  const fetchPosts = () => {
    if (userId && token) {
      axios
        .get(`${Api.GET_COMMUNITY_POST}/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const fetchedPosts = response.data.posts || [];
          setPosts(fetchedPosts);
        })
        .catch((error) => toast.error(error.response?.data?.message || "Error fetching posts"));
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [userId, token, refreshKey]);

  // Safe check whether userId is in the likes array (handles ObjectIds and populated user objects)
  const isLikedByUser = (likes) => {
    if (!likes || !userId) return false;
    return likes.some((like) => {
      const likeId = typeof like === "object" ? (like._id || like) : like;
      return likeId.toString() === userId.toString();
    });
  };

  const handleLike = async (post) => {
    try {
      const liked = isLikedByUser(post.likes);
      const likeAction = liked ? "unlike" : "like";

      // Optimistic UI update
      const updatedPosts = posts.map((p) =>
        p._id === post._id
          ? {
            ...p,
            likes: likeAction === "like"
              ? [...p.likes, userId]
              : p.likes.filter((like) => {
                  const likeId = typeof like === "object" ? (like._id || like) : like;
                  return likeId.toString() !== userId.toString();
                }),
          }
          : p
      );
      setPosts(updatedPosts);

      await axios.post(`${Api.BASIC_POST_ROUTE}/${post._id}/${likeAction}`, {}, { headers: { Authorization: `Bearer ${token}` } });

      if (likeAction === "like") {
        // Get the post owner's ID from the post's userId (could be populated object or string)
        const postOwnerId = typeof post.userId === "object" ? post.userId._id : post.userId;
        if (postOwnerId && postOwnerId.toString() !== userId.toString()) {
          const notificationData = {
            receiver_id: postOwnerId,
            notification_type: "like",
            sender_id: userId,
          };
          await axios.post(Api.SEND_NOTIFICATION, notificationData, { headers: { Authorization: `Bearer ${token}` } });
        }
      }

    } catch (error) {
      // Rollback on failure
      fetchPosts();
      toast.error("Error updating like status");
    }
      const previousPosts = posts;

      const updatedPosts = posts.map((p) =>
        p._id === post._id
          ? {
              ...p,
              likes:
                likeAction === "like"
                  ? [...(p.likes || []), userId]
                  : (p.likes || []).filter((like) => {
                      const likeId = typeof like === "object" ? (like._id || like) : like;
                      return likeId.toString() !== userId.toString();
                    }),
            }
          : p
      );

      setPosts(updatedPosts);

      const response = await axios.post(`${Api.BASIC_POST_ROUTE}/${post._id}/${likeAction}`, {}, { headers: { Authorization: `Bearer ${token}` } });

      // Sync with server response likes when available
      const serverLikes = response.data?.likes;
      if (serverLikes) {
        setPosts((prev) => prev.map((p) => (p._id === post._id ? { ...p, likes: serverLikes } : p)));
      }

      if (likeAction === "like") {
        // Get the post owner's ID from the post's userId (could be populated object or string)
        const postOwnerId = typeof post.userId === "object" ? post.userId._id : post.userId;
        if (postOwnerId && postOwnerId.toString() !== userId.toString()) {
          const notificationData = {
            receiver_id: postOwnerId,
            notification_type: "like",
            sender_id: userId,
          };
          await axios.post(Api.SEND_NOTIFICATION, notificationData, { headers: { Authorization: `Bearer ${token}` } });
        }
      }
      try {
      // Rollback on failure to previous optimistic state
      setPosts((prev) => prev.map((p) => {
        const original = previousPosts.find(op => op._id === p._id) || p;
        return original;
      }));
      toast.error("Error updating like status");
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Find the post to get the owner's ID for notification
        const currentPost = posts.find(p => p._id === postId);
        if (currentPost) {
          const postOwnerId = typeof currentPost.userId === "object" ? currentPost.userId._id : currentPost.userId;
          if (postOwnerId && postOwnerId.toString() !== userId.toString()) {
            const notificationData = {
              receiver_id: postOwnerId,
              notification_type: "comment",
              sender_id: userId,
            };
            await axios.post(Api.SEND_NOTIFICATION, notificationData, { headers: { Authorization: `Bearer ${token}` } });
          }
        }

        const createdComment = response.data?.comment || response.data?.newComment;
        toast.success("Comment added successfully");
        setComments((prev) => ({ ...prev, [postId]: "" }));

        // Refresh the comment modal if open
        if (activeCommentPost && activeCommentPost._id === postId) {
          const updatedPost = await handleCommentPost(postId);
          setActiveCommentPost(updatedPost);
        }

        // Update comment list in feed using server-returned comment when possible
        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p._id === postId
              ? { ...p, comments: [...(p.comments || []), createdComment || { userId: { username: "You" }, comment: newComment }] }
              : p
          )
        );
      } catch (error) {
        toast.error("Error adding comment");
      }
    }
  };

  const handleShare = async (post) => {
    try {
      const response = await axios.post(
        `${Api.BASIC_POST_ROUTE}/${post._id}/share`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 201) {
        toast.success("Post shared successfully");
        // Update share count in local state
        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p._id === post._id ? { ...p, shares: (p.shares || 0) + 1 } : p
          )
        );
      }
    } catch (error) {
      toast.error("Error sharing post");
    }
  };

  const handleEmojiClick = (emojiData) => {
    if (activeEmojiPicker) {
      setComments((prev) => ({
        ...prev,
        [activeEmojiPicker]: (prev[activeEmojiPicker] || "") + emojiData.emoji,
      }));
    }
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
                    {isLikedByUser(post.likes) ? <AiFillHeart size={24} color="red" /> : <AiOutlineHeart size={24} color="black" />}
                  </button>
                  <span style={styles.likeCount}>{post.likes.length} Likes</span>
                  <button style={styles.commentButton} onClick={() => handleCommentToggle(post._id)}>
                    <AiOutlineComment size={26} color="black" />
                  </button>
                  <span style={styles.commentCount}>{post.comments.length} Comments</span>
                  <button style={styles.shareButton} onClick={() => handleShare(post)}>
                    <RiSendPlaneFill size={24} color="black" />
                  </button>
                  <span style={styles.shareCount}>{post.shares || 0} Shares</span>
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
                    value={comments[post._id] || ""}
                    onChange={(e) => handleCommentChange(post._id, e.target.value)}
                    placeholder="Add a comment..."
                  />
                  <span><button style={styles.commentPostButton} onClick={() => handleCommentSubmit(post._id)} disabled={!(comments[post._id] || "").trim()}>Post</button></span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Commenting — now renders comments list */}

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
            {activeCommentPost?.comments && activeCommentPost.comments.length > 0 ? (
              activeCommentPost.comments.map((comment, index) => (
                <div key={comment._id || index} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                  <strong>{comment?.userId?.username || "User"}</strong>
                  <p style={{ margin: '4px 0 0 0' }}>{comment.comment}</p>
                </div>
              ))
            ) : (
              <p style={{ color: '#999' }}>No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FeedHome;
