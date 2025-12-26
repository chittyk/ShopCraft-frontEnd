// 📁 WriteReview.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X } from "lucide-react";
import Api from "../../utils/Api";
import { successAlert, errorAlert, warningAlert } from "../../utils/alert";

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

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!rating || !comment.trim()) {
      warningAlert("Please select rating and comment");
      return;
    }

    try {
      if (isUpdate) {
        await Api.put(
          `${import.meta.env.VITE_PRODUCT_REVIEW}/${productId}`,
          { rating, comment }
        );

        successAlert("Review updated!");
      } else {
        await Api.post(`${import.meta.env.VITE_PRODUCT_REVIEW}`, {
          productId,
          rating,
          comment,
        });

        successAlert("Review added!");
      }

      setShowForm(false);
      refresh();
    } catch (err) {
      errorAlert("Failed to submit review");
    }
  };

  return (
    <AnimatePresence>
      {showForm && (
        <motion.div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <motion.div className="bg-gray-900 p-6 rounded-xl border border-gray-700 w-[400px]">

            <div className="flex justify-between mb-4">
              <h2 className="text-yellow-300">Write Review</h2>
              <X className="cursor-pointer" onClick={() => setShowForm(false)} />
            </div>

            <form onSubmit={handleSubmitReview}>
              <div className="flex justify-center gap-2 mb-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Star
                    key={i}
                    size={rating >= i + 1 ? 32 : 28}
                    onMouseEnter={() => setHoveredRating(i + 1)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(i + 1)}
                    className={
                      rating >= i + 1
                        ? "text-yellow-400 fill-yellow-400 cursor-pointer"
                        : hoveredRating === i + 1
                        ? "text-yellow-300 fill-yellow-300 cursor-pointer"
                        : "text-gray-700 cursor-pointer"
                    }
                  />
                ))}
              </div>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-gray-800 p-2 border border-gray-700 rounded mb-3"
                rows="4"
                placeholder="Write your review..."
              />

              <button className="w-full bg-yellow-400 text-black rounded py-2 font-bold">
                {isUpdate ? "Update Review" : "Submit Review"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default WriteReview;
