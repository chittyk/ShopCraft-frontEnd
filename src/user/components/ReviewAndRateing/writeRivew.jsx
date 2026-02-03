// 📁 WriteReview.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X } from "lucide-react";
import Api from "../../../utils/Api";
import { successAlert, errorAlert, warningAlert } from "../../../utils/Alert";

function WriteReview({
  showForm,
  setShowForm,
  productId,
  oldRating = 0,
  oldComment = "",
  refresh,
  isUpdate = false,
}) {
  const [rating, setRating] = useState(oldRating);
  const [comment, setComment] = useState(oldComment);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!rating || !comment.trim()) {
      warningAlert("Please select rating and comment");
      return;
    }

    if (loading) return;

    try {
      setLoading(true);

      if (isUpdate) {
        await Api.put(
          `http://localhost:8087/api/review/${productId}`,
          { rating, comment }
        );
        successAlert("Review updated!");
      } else {
        await Api.post(`http://localhost:8087/api/review`, {
          productId,
          rating,
          comment,
        });
        successAlert("Review added!");
      }

      setShowForm(false);
      refresh();
    } catch (err) {
      console.log(err.response)
      errorAlert(
        err?.response?.data?.msg || "Failed to submit review"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {showForm && (
        <motion.div
          className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
          onClick={() => setShowForm(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-900 p-6 rounded-xl border border-gray-700 w-[400px]"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-yellow-300 text-lg font-semibold">
                Write Review
              </h2>
              <X
                className="cursor-pointer text-gray-400 hover:text-white"
                onClick={() => setShowForm(false)}
              />
            </div>

            <form onSubmit={handleSubmitReview}>
              {/* Stars */}
              <div className="flex justify-center gap-2 mb-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Star
                    key={i}
                    size={28}
                    onMouseEnter={() => setHoveredRating(i + 1)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(i + 1)}
                    className={
                      (hoveredRating || rating) >= i + 1
                        ? "text-yellow-400 fill-yellow-400 cursor-pointer transition"
                        : "text-gray-700 cursor-pointer transition"
                    }
                  />
                ))}
              </div>

              {/* Comment */}
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-gray-800 p-2 border border-gray-700 rounded mb-4 text-sm focus:outline-none focus:border-yellow-400"
                rows="4"
                placeholder="Write your review..."
              />

              {/* Submit */}
              <button
                disabled={loading}
                className="w-full bg-yellow-400 text-black rounded py-2 font-bold hover:bg-yellow-300 transition disabled:opacity-60"
              >
                {loading
                  ? "Submitting..."
                  : isUpdate
                  ? "Update Review"
                  : "Submit Review"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default WriteReview;
