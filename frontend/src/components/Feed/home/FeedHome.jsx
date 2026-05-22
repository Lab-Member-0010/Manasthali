import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { AiOutlineHeart, AiFillHeart, AiOutlineComment } from "react-icons/ai";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { RiSendPlaneFill } from "react-icons/ri";
import Modal from "react-modal";
import EmojiPicker from 'emoji-picker-react';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import Api from "../../../apis/Api";
const styles = {
feedContainer: {
  display: 'flex',
  justifyContent: 'center',
},
  postCardContainer: {
  display: 'flex',
  justifyContent: 'center',
  marginTop: '10px',
},
  cardHeader: {
  borderBottom: '1px solid lightgray',
  backgroundColor: 'rgb(248, 248, 248)',
  margin: 0,
},
  userName: {
  fontSize: '20px',
  fontWeight: 'bold',
  marginLeft: '5px',
},
  commentTextbox: {
  borderBottom: '1px solid lightgray',
},
  commentTextField: {
  border: 'none',
  marginLeft: '2px',
  width: '80%',
  fontSize: '15px',
},
  emojiButton: {
  background: 'none',
  border: 'none',
  width: '8%',
  height: '7px',
  color: '#6e6767',
},
  emojiPickerContainer: {
  position: 'absolute',
  bottom: '70px',
  left: '20px',
  zIndex: 15,
  backgroundColor: '#ffffff',
  border: '1px solid #d4c7e0',
  borderRadius: '10px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
},
  commentPostButton: {
  background: 'none',
  color: 'blue',
  fontWeight: 'bold',
  fontSize: '15px',
  border: 'none',
  marginLeft: '2%',
  width: '8%',
},
  postDescription: {
  margin: 0,
  fontSize: '20px',
},
  postImage: {
  width: '550px',
  height: '400px',
},
  likeButton: {
  marginRight: '5px',
  background: 'none',
  border: 'none',
  padding: 0,
},
  commentButton: {
  margin: '0px 5px 0px 15px',
  background: 'none',
  border: 'none',
  padding: 0,
},
  shareButton: {
  margin: '0px 5px 0px 15px',
  background: 'none',
  border: 'none',
  padding: 0,
},
  roundedProfile: {
  height: '35px',
  width: '35px',
  border: '1px solid black',
  borderRadius: '50%',
  margin: '0px 10px 0px 10px',
},
  likeCommentShareButton: {
  display: 'flex',
  alignItems: 'center',
},
  likeCount: {
  fontSize: '16px',
},
  commentCount: {
  fontSize: '16px',
},
  shareCount: {
  fontSize: '16px',
},
  modalContent: {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'rgb(251, 248, 248)',
  borderRadius: '10px',
  zIndex: 9999,
  height: '70%',
  width: '70%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
},
  modalOverlay: {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0, 0, 0, 0.5)',
  zIndex: 9998,
},
  closeModalButton: {
  background: 'none',
  width: '4%',
  height: '100%',
  border: '1px solid gray',
  borderRadius: '50%',
  fontWeight: 'bold',
  fontSize: '10px',
  color: 'lightgray',
  backgroundColor: 'white',
},
  closeButton: {
  width: '100%',
  height: '4%',
  display: 'flex',
  justifyContent: 'end',
  paddingRight: '5px',
},
  postComments: {
  width: '50%',
  height: '100%',
  textAlign: 'start',
  display: 'flex',
  flexDirection: 'column',
},
  postMedia: {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '50%',
  height: '100%',
  borderRadius: '10px 0px 0px 10px',
},
  modalPostImage: {
  width: '100%',
  height: '100%',
},
  postCommentsInnerDiv: {
  height: '96%',
  width: '100%',
  maxHeight: '100%',
  overflowY: 'scroll',
  scrollbarWidth: 'thin',
}
};

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
      fetchPosts();
      toast.error("Error updating like status");
    }
  };

  const handleCommentChange = (postId, value) => {
    setComments((prev) => ({ ...prev, [postId]: value }));
  };

  const handleCommentToggle = async (postId) => {
    try {
      const response = await axios.get(`${Api.BASIC_POST_ROUTE}/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActiveCommentPost(response.data.post || response.data);
    } catch (error) {
      toast.error("Error fetching post details");
    }
  };

  const handleCommentPost = async (postId) => {
    try {
      const response = await axios.get(`${Api.BASIC_POST_ROUTE}/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.post || response.data;
    } catch (error) {
      toast.error("Error fetching post details");
    }
  };

  const handleCommentSubmit = async (postId) => {
    if (!comments[postId]?.trim()) return;
    try {
      const commentText = comments[postId];
      const response = await axios.post(
        `${Api.BASIC_POST_ROUTE}/${postId}/comment`,
        { comment: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

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

      if (activeCommentPost && activeCommentPost._id === postId) {
        const updatedPost = await handleCommentPost(postId);
        setActiveCommentPost(updatedPost);
      }

      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p._id === postId
            ? { ...p, comments: [...(p.comments || []), createdComment || { userId: { username: "You" }, comment: commentText }] }
            : p
        )
      );
    } catch (error) {
      toast.error("Error adding comment");
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
                {post.shared_post_id && (
                  <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, marginTop: 8, background: '#f9f9f9' }}>
                    <small>Shared post</small>
                    <p style={{ margin: '4px 0' }}>{(typeof post.shared_post_id === 'object' ? post.shared_post_id.description : '') || ''}</p>
                  </div>
                )}
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
