import React from "react";
import Modal from "react-modal";

const CommentModal = ({ activeCommentPost, onClose }) => {
  return (
    <Modal
      isOpen={activeCommentPost !== null}
      onRequestClose={onClose}
      contentLabel="Add Comment"
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-50 rounded-lg z-50 h-3/4 w-3/4 flex flex-row"
      overlayClassName="fixed inset-0 bg-black/50 z-40"
    >
      <div className="flex justify-center items-center w-1/2 h-full rounded-l-lg">
        {activeCommentPost?.media?.[0] && (
          <img
            src={activeCommentPost.media[0]}
            alt="Post media"
            className="w-full h-full object-contain"
          />
        )}
      </div>
      <div className="w-1/2 h-full text-left flex flex-col">
        <div className="w-full h-[4%] flex justify-end pr-[5px]">
          <button
            className="bg-white border border-gray-400 rounded-full font-bold text-xs text-gray-300 w-6 h-6"
            onClick={onClose}
            aria-label="Close comment modal"
          >
            X
          </button>
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
  );
};

export default CommentModal;
