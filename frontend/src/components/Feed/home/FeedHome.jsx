import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import useFeed from "../../../hooks/useFeed";
import PostCard from "./PostCard";
import CommentModal from "./CommentModal";

Modal.setAppElement('#root');

const FeedHome = ({ refreshKey }) => {
  const {
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
  } = useFeed(refreshKey);

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
          <PostCard
            key={post._id}
            post={post}
            isLikedByUser={isLikedByUser}
            onLike={handleLike}
            onCommentToggle={handleCommentToggle}
            onCommentChange={handleCommentChange}
            onCommentSubmit={handleCommentSubmit}
            onShare={handleShare}
            comments={comments}
            activeEmojiPicker={activeEmojiPicker}
            onToggleEmojiPicker={toggleEmojiPicker}
            onEmojiClick={handleEmojiClick}
          />
        ))}
      </div>

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

      <CommentModal
        activeCommentPost={activeCommentPost}
        onClose={() => setActiveCommentPost(null)}
      />
    </div>
  );
};

export default FeedHome;
