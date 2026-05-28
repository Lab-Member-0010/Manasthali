import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Api from "../apis/Api";

const useFeed = (refreshKey) => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [comments, setComments] = useState({});
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [activeEmojiPicker, setActiveEmojiPicker] = useState(null);
  const sentinelRef = useRef(null);

  const userId = useSelector((state) => state?.user?.user?._id);
  const token = useSelector((state) => state?.user?.token);

  const fetchPosts = useCallback(async (pageNum, append = false) => {
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
  }, [userId, token]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setPosts([]);
    setInitialLoading(true);
    fetchPosts(1, false);
  }, [fetchPosts, refreshKey]);

  useEffect(() => {
    if (page > 1) {
      fetchPosts(page, true);
    }
  }, [page, fetchPosts]);

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

  const isLikedByUser = useCallback((likes) => {
    if (!likes || !userId) return false;
    return likes.some((like) => {
      const likeId = typeof like === "object" ? (like._id || like) : like;
      return likeId.toString() === userId.toString();
    });
  }, [userId]);

  const handleLike = useCallback(async (post) => {
    try {
      const liked = isLikedByUser(post.likes);
      const likeAction = liked ? "unlike" : "like";

      setPosts((prev) =>
        prev.map((p) =>
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
        )
      );

      await axios.post(`${Api.BASIC_POST_ROUTE}/${post._id}/${likeAction}`, {}, { headers: { Authorization: `Bearer ${token}` } });

      if (likeAction === "like") {
        const postOwnerId = typeof post.userId === "object" ? post.userId._id : post.userId;
        if (postOwnerId && postOwnerId.toString() !== userId.toString()) {
          await axios.post(Api.SEND_NOTIFICATION, {
            receiver_id: postOwnerId,
            notification_type: "like",
            sender_id: userId,
          }, { headers: { Authorization: `Bearer ${token}` } });
        }
      }
    } catch (error) {
      toast.error("Error updating like status");
    }
  }, [userId, token, isLikedByUser]);

  const handleCommentChange = useCallback((postId, value) => {
    setComments((prev) => ({ ...prev, [postId]: value }));
  }, []);

  const handleCommentToggle = useCallback(async (postId) => {
    try {
      const response = await axios.get(`${Api.BASIC_POST_ROUTE}/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActiveCommentPost(response.data.post || response.data);
    } catch (error) {
      toast.error("Error fetching post details");
    }
  }, [token]);

  const handleCommentSubmit = useCallback(async (postId) => {
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
          await axios.post(Api.SEND_NOTIFICATION, {
            receiver_id: postOwnerId,
            notification_type: "comment",
            sender_id: userId,
          }, { headers: { Authorization: `Bearer ${token}` } });
        }
      }

      const createdComment = response.data?.comment || response.data?.newComment;
      toast.success("Comment added successfully");
      setComments((prev) => ({ ...prev, [postId]: "" }));

      if (activeCommentPost && activeCommentPost._id === postId) {
        const refreshed = await axios.get(`${Api.BASIC_POST_ROUTE}/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setActiveCommentPost(refreshed.data.post || refreshed.data);
      }

      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, comments: [...(p.comments || []), createdComment || { userId: { username: "You" }, comment: commentText }] }
            : p
        )
      );
    } catch (error) {
      toast.error("Error adding comment");
    }
  }, [comments, token, userId, posts, activeCommentPost]);

  const handleShare = useCallback(async (post) => {
    try {
      const response = await axios.post(
        `${Api.BASIC_POST_ROUTE}/${post._id}/share`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 201) {
        toast.success("Post shared successfully");
        setPosts((prev) =>
          prev.map((p) =>
            p._id === post._id ? { ...p, shares: (p.shares || 0) + 1 } : p
          )
        );
      }
    } catch (error) {
      toast.error("Error sharing post");
    }
  }, [token]);

  const handleEmojiClick = useCallback((emojiData) => {
    if (activeEmojiPicker) {
      setComments((prev) => ({
        ...prev,
        [activeEmojiPicker]: (prev[activeEmojiPicker] || "") + emojiData.emoji,
      }));
    }
  }, [activeEmojiPicker]);

  const toggleEmojiPicker = useCallback((postId) => {
    setActiveEmojiPicker((prev) => (prev === postId ? null : postId));
  }, []);

  return {
    posts,
    loading,
    initialLoading,
    hasMore,
    comments,
    activeCommentPost,
    activeEmojiPicker,
    sentinelRef,
    isLikedByUser,
    handleLike,
    handleCommentChange,
    handleCommentToggle,
    handleCommentSubmit,
    handleShare,
    handleEmojiClick,
    toggleEmojiPicker,
    setActiveCommentPost,
  };
};

export default useFeed;
