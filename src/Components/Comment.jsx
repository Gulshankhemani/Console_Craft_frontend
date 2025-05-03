import React, { useState, useEffect } from "react";
import axios from "axios";

const Comment = () => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No access token found. Please log in.");
        }
        console.log("Fetching comments with token:", token); // Debug log
        const response = await axios.get("http://localhost:8000/api/v1/comments", {
          params: { page: 1, limit: 10 },
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
        console.log("Fetch comments response:", response.data); // Debug log
        setComments(response.data.message.comments || []);
      } catch (err) {
        console.error("Fetch comments error:", err.response || err);
        setError(`Failed to load comments: ${err.response?.data?.message || err.message || "Please try again."}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchComments();
  }, []);

  const onComment = async (content, parentCommentId = null) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No access token found. Please log in.");
      }
      console.log("Posting comment:", { content, parentCommentId, token });
      const response = await axios.post(
        "http://localhost:8000/api/v1/comments/comment",
        { content, parentCommentId },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      console.log("Post comment response:", response.data);
      const newComment = response.data.data;
      setComments((prev) => [newComment, ...prev]);
      setError(null); // Clear error on success
    } catch (err) {
      console.error("Post comment error:", err.response || err);
      setError(`Failed to post comment: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Comments</h2>
      {isLoading && <div className="text-gray-600">Loading comments...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <CommentInput onComment={onComment} />
      <div className="mt-6 space-y-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            setComments={setComments}
          />
        ))}
      </div>
    </div>
  );
};

const CommentInput = ({ onComment, parentCommentId }) => {
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError("Comment cannot be empty");
      return;
    }
    try {
      await onComment(content, parentCommentId);
      setContent("");
      setError(null);
    } catch (err) {
      setError("Failed to submit comment. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What are your thoughts?"
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
        rows={3}
      />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button
        onClick={handleSubmit}
        className="self-end px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Comment
      </button>
    </div>
  );
};

const CommentItem = React.memo(({ comment, setComments, depth = 0 }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [vote, setVote] = useState(0);
  const [error, setError] = useState(null);
  const currentUserId = localStorage.getItem("userId");
  const isOwner = comment.owner?._id === currentUserId;

  const handleReply = async (content, parentCommentId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No access token found. Please log in.");
      }
      console.log("Posting reply:", { content, parentCommentId, token });
      const response = await axios.post(
        "http://localhost:8000/api/v1/comments/comment",
        { content, parentCommentId },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      console.log("Post reply response:", response.data);
      const newReply = response.data.data;
      setComments((prev) => {
        const updateReplies = (comments) => {
          return comments.map((c) => {
            if (c._id === parentCommentId) {
              return { ...c, replies: [newReply, ...(c.replies || [])] };
            }
            return { ...c, replies: updateReplies(c.replies || []) };
          });
        };
        return updateReplies(prev);
      });
      setIsReplying(false);
      setError(null);
    } catch (err) {
      console.error("Post reply error:", err.response || err);
      setError(`Failed to post reply: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No access token found. Please log in.");
      }
      const response = await axios.put(
        `http://localhost:8000/api/v1/comments/comment/${comment._id}`,
        { content: editContent },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      const updatedComment = response.data.data;
      setComments((prev) => {
        const updateComment = (comments) => {
          return comments.map((c) => {
            if (c._id === comment._id) {
              return updatedComment;
            }
            return { ...c, replies: updateComment(c.replies || []) };
          });
        };
        return updateComment(prev);
      });
      setIsEditing(false);
      setError(null);
    } catch (err) {
      console.error("Edit comment error:", err.response || err);
      setError(`Failed to update comment: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No access token found. Please log in.");
      }
      await axios.delete(
        `http://localhost:8000/api/v1/comments/comment/${comment._id}`,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      setComments((prev) => {
        const removeComment = (comments) => {
          return comments
            .filter((c) => c._id !== comment._id)
            .map((c) => ({
              ...c,
              replies: removeComment(c.replies || []),
            }));
        };
        return removeComment(prev);
      });
      setError(null);
    } catch (err) {
      console.error("Delete comment error:", err.response || err);
      setError(`Failed to delete comment: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleUpvote = () => setVote((prev) => (prev === 1 ? 0 : 1));
  const handleDownvote = () => setVote((prev) => (prev === -1 ? 0 : -1));

  return (
    <div className={`flex gap-2 ${depth > 0 ? "ml-6 border-l-2 border-gray-200 pl-4" : ""}`}>
      <div className="flex flex-col items-center">
        <img
          src={comment.owner?.avatar || "https://via.placeholder.com/32"}
          alt={comment.owner?.Username || "User"}
          className="w-8 h-8 rounded-full"
        />
        <div className="flex flex-col items-center mt-2">
          <button onClick={handleUpvote} className="text-gray-500 hover:text-blue-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v7.333H6z" />
            </svg>
          </button>
          <span className="text-sm text-gray-600">{vote}</span>
          <button onClick={handleDownvote} className="text-gray-500 hover:text-blue-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.057 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-7.667h3z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-800">
            {comment.owner?.Username || "Unknown User"}
          </span>
          <span className="text-xs text-gray-500">
            {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : "Invalid Date"}
          </span>
        </div>
        {isEditing ? (
          <div className="mt-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              rows={3}
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleEdit}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-700 mt-1">{comment.content}</p>
        )}
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        <div className="flex gap-3 mt-2 text-sm text-gray-500">
          <button
            onClick={() => setIsReplying(!isReplying)}
            className="hover:text-blue-600"
          >
            Reply
          </button>
          {isOwner && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="hover:text-blue-600"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="hover:text-red-600"
              >
                Delete
              </button>
            </>
          )}
        </div>
        {isReplying && (
          <div className="mt-4">
            <CommentInput
              onComment={handleReply}
              parentCommentId={comment._id}
            />
          </div>
        )}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-4">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply._id}
                comment={reply}
                setComments={setComments}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

export default Comment;