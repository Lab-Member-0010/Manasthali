import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { AiOutlineHeart, AiFillHeart, AiOutlineComment } from "react-icons/ai";
import "react-toastify/dist/ReactToastify.css";
import { RiSendPlaneFill } from "react-icons/ri";
import Modal from "react-modal";
import EmojiPicker from 'emoji-picker-react';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import Api from "../../../apis/Api";


Modal.setAppElement('#root');

const FeedHome = ({ refreshKey }) => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  // Per-post comment state, keyed by post ID — prevents one input controlling every post
  const [comments, setComments] = useState({});
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [activeEmojiPicker, setActiveEmojiPicker] = useState(null);
  const sentinelRef = useRef(null);

  const userId = useSelector((state) => state?.user?.user?._id);
  const token = useSelector((state) => state?.user?.token);

  const fetchPosts = async (pageNum, append = false) => {
    if (!userId || !token) return;
    setLoading(true);
    try {
      const response = await axios.get(`${Api.GET_COMMUNITY_POST}/${userId}?page=${pageNum}&limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fetchedPosts = response.data.posts || [];
      setHasMore(response.data.hasMore !== false);
      if (append) {
        setPosts((prev) => [...prev, ...fetchedPosts]);
      } else {
        setPosts(fetchedPosts);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching posts");
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setPosts([]);
    setInitialLoading(true);
    fetchPosts(1, false);
  }, [userId, token, refreshKey]);

  useEffect(() => {
    if (page > 1) {
      fetchPosts(page, true);
    }
  }, [page]);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading]);

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

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-purple-600 text-xl">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <ToastContainer />
      <div className="flex flex-wrap w-full">
        {posts.map((post) => (
          <div key={post._id} className="flex justify-center mt-2 w-full">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm w-full max-w-2xl">
              <div className="border-b border-gray-200 bg-gray-50 p-3">
                <img src={post?.userId?.profile_picture || "default-profile.jpg"} alt="Profile" className="w-9 h-9 border border-black rounded-full mx-2 inline" />
                <span className="text-xl font-bold ml-2">{post?.userId?.username || "Unknown User"}</span>
              </div>
              <div className="p-4">
                <p className="m-0 text-lg">{post.description}</p>
                {post.media?.[0] && <img src={post.media[0]} alt="Post" className="w-full max-w-[550px] h-48 md:h-96 object-cover rounded" />}
                {post.shared_post_id && (
                  <div className="border border-[#ddd] rounded-lg p-3 mt-2 bg-[#f9f9f9]">
                    <small>Shared post</small>
                    <p className="my-1">{(typeof post.shared_post_id === 'object' ? post.shared_post_id.description : '') || ''}</p>
                  </div>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <button className="bg-transparent border-none p-0 cursor-pointer" onClick={() => handleLike(post)}>
                    {isLikedByUser(post.likes) ? <AiFillHeart size={24} color="red" /> : <AiOutlineHeart size={24} color="black" />}
                  </button>
                  <span className="text-base">{post.likes.length} Likes</span>
                  <button className="bg-transparent border-none p-0 cursor-pointer" onClick={() => handleCommentToggle(post._id)}>
                    <AiOutlineComment size={26} color="black" />
                  </button>
                  <span className="text-base">{post.comments.length} Comments</span>
                  <button className="bg-transparent border-none p-0 cursor-pointer" onClick={() => handleShare(post)}>
                    <RiSendPlaneFill size={24} color="black" />
                  </button>
                  <span className="text-base">{post.shares || 0} Shares</span>
                </div>
                <div className="border-b border-gray-300">
                  <button className="bg-transparent border-none w-8 h-2 cursor-pointer" onClick={() => toggleEmojiPicker(post._id)}>
                    <EmojiEmotionsOutlinedIcon/>
                  </button>

                  {activeEmojiPicker === post._id && (
                    <div className="absolute bottom-16 left-5 z-10 bg-white border rounded-lg shadow">
                      <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>
                  )}
                  <input
                    type="text"
                    className="border-none ml-1 w-4/5 text-sm outline-none"
                    value={comments[post._id] || ""}
                    onChange={(e) => handleCommentChange(post._id, e.target.value)}
                    placeholder="Add a comment..."
                  />
                  <span><button className="bg-transparent text-blue-600 font-bold border-none ml-2 w-1/12" onClick={() => handleCommentSubmit(post._id)} disabled={!(comments[post._id] || "").trim()}>Post</button></span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sentinel for infinite scroll */}
      <div ref={sentinelRef} className="w-full h-10" />
      {loading && (
        <div className="w-full text-center py-4 text-purple-600">
          Loading more posts...
        </div>
      )}
      {!hasMore && posts.length > 0 && (
        <div className="w-full text-center py-4 text-gray-500">
          You've reached the end of the feed.
        </div>
      )}

      {/* Modal for Commenting — now renders comments list */}

      <Modal
        isOpen={activeCommentPost !== null}
        onRequestClose={() => setActiveCommentPost(null)}
        contentLabel="Add Comment"
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-50 rounded-lg z-50 h-3/4 w-3/4 flex flex-row" overlayClassName="fixed inset-0 bg-black/50 z-40"
      >
        <div className="flex justify-center items-center w-1/2 h-full rounded-l-lg">
          {activeCommentPost?.media?.[0] && (
            <img src={activeCommentPost.media[0]} alt="Post" className="w-full h-full" />
          )}
        </div>
        <div className="w-1/2 h-full text-left flex flex-col">
          <div className="w-full h-[4%] flex justify-end pr-[5px]">
            <button className="bg-white border border-gray-400 rounded-full font-bold text-xs text-gray-300 w-6 h-6" onClick={() => setActiveCommentPost(null)}>X</button>
          </div>
          <div className="h-5/6 w-full overflow-y-auto scrollbar-thin">
            {activeCommentPost?.comments && activeCommentPost.comments.length > 0 ? (
              activeCommentPost.comments.map((comment, index) => (
                <div key={comment._id || index} className="py-2 border-b border-[#eee]">
                  <strong>{comment?.userId?.username || "User"}</strong>
                  <p className="mt-1 mb-0">{comment.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-[#999]">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FeedHome;
