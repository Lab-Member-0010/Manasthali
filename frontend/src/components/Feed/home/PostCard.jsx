import React from "react";
import { AiOutlineHeart, AiFillHeart, AiOutlineComment } from "react-icons/ai";
import { RiSendPlaneFill } from "react-icons/ri";
import EmojiPicker from "emoji-picker-react";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";

const PostCard = ({
  post,
  isLikedByUser,
  onLike,
  onCommentToggle,
  onCommentChange,
  onCommentSubmit,
  onShare,
  comments,
  activeEmojiPicker,
  onToggleEmojiPicker,
  onEmojiClick,
}) => {
  return (
    <div className="flex justify-center mt-2 w-full">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm w-full max-w-2xl">
        <div className="border-b border-gray-200 bg-gray-50 p-3">
          <img
            src={post?.userId?.profile_picture || "default-profile.jpg"}
            alt={`${post?.userId?.username || "User"}'s profile`}
            className="w-9 h-9 border border-black rounded-full mx-2 inline"
          />
          <span className="text-xl font-bold ml-2">{post?.userId?.username || "Unknown User"}</span>
        </div>
        <div className="p-4">
          <p className="m-0 text-lg">{post.description}</p>
          {post.media?.[0] && (
            <img
              src={post.media[0]}
              alt={post.description || "Post image"}
              className="w-full max-w-[550px] h-48 md:h-96 object-cover rounded"
            />
          )}
          {post.shared_post_id && (
            <div className="border border-[#ddd] rounded-lg p-3 mt-2 bg-[#f9f9f9]">
              <small>Shared post</small>
              <p className="my-1">
                {(typeof post.shared_post_id === "object" ? post.shared_post_id.description : "") || ""}
              </p>
            </div>
          )}
          <div className="flex items-center gap-2 mt-2">
            <button
              className="bg-transparent border-none p-0 cursor-pointer"
              onClick={() => onLike(post)}
              aria-label={isLikedByUser(post.likes) ? "Unlike post" : "Like post"}
            >
              {isLikedByUser(post.likes) ? (
                <AiFillHeart size={24} color="red" />
              ) : (
                <AiOutlineHeart size={24} color="black" />
              )}
            </button>
            <span className="text-base">{post.likes.length} Likes</span>
            <button
              className="bg-transparent border-none p-0 cursor-pointer"
              onClick={() => onCommentToggle(post._id)}
              aria-label="Comment on post"
            >
              <AiOutlineComment size={26} color="black" />
            </button>
            <span className="text-base">{post.comments.length} Comments</span>
            <button
              className="bg-transparent border-none p-0 cursor-pointer"
              onClick={() => onShare(post)}
              aria-label="Share post"
            >
              <RiSendPlaneFill size={24} color="black" />
            </button>
            <span className="text-base">{post.shares || 0} Shares</span>
          </div>
          <div className="border-b border-gray-300">
            <button
              className="bg-transparent border-none w-8 h-2 cursor-pointer"
              onClick={() => onToggleEmojiPicker(post._id)}
              aria-label="Open emoji picker"
            >
              <EmojiEmotionsOutlinedIcon />
            </button>

            {activeEmojiPicker === post._id && (
              <div className="absolute bottom-16 left-5 z-10 bg-white border rounded-lg shadow">
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </div>
            )}
            <input
              type="text"
              className="border-none ml-1 w-4/5 text-sm outline-none"
              value={comments[post._id] || ""}
              onChange={(e) => onCommentChange(post._id, e.target.value)}
              placeholder="Add a comment..."
              aria-label="Write a comment"
            />
            <span>
              <button
                className="bg-transparent text-blue-600 font-bold border-none ml-2 w-1/12"
                onClick={() => onCommentSubmit(post._id)}
                disabled={!(comments[post._id] || "").trim()}
                aria-label="Submit comment"
              >
                Post
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
