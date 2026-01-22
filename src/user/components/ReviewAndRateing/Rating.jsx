import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Star,
  ChevronDown,
  ChevronUp,
  Pencil,
  Clock,
  TrendingUp,
  TrendingDown,
  UserStar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { errorAlert } from "../../../utils/Alert";

import WriteReview from "./writeRivew";
import EditorDeleteReview from "./EditorDeleteReview";
import Api from "../../../utils/Api.js";

function ReviewSummary({ productId }) {
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("recent");
  const [showForm, setShowForm] = useState(false);
  const [reviewTrigger,setReviewTrigger]=useState(0)
  const observerRef = useRef(null);

  // ⭐ Rating Summary States
  const [ratings, setRatings] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  });
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);

  const [isReview, setIsReview] = useState(false);
  useEffect(() => {
    const isReview = async () => {
      try {
        const res = await Api.get(
          `${import.meta.env.VITE_PRODUCT_REVIEW}/getOneReview/${productId}`
        );
        setIsReview(true);
      } catch (error) {
        setIsReview(false);
        console.log("Failed to fetch user review:", error);
      }
    };

    isReview();
  }, [productId,reviewTrigger]);

  //  Fetch Rating Summary
  const fetchRatingSummary = async () => {
    if (!productId) return;

    try {
      const res = await Api.get(
        `${import.meta.env.VITE_PRODUCT_REVIEW}/rating/${productId}`
      );

      const { ratings, averageRating, totalReviews } = res.data;
      setRatings(ratings || {});
      setAverageRating(averageRating || 0);
      setTotalRatings(totalReviews || 0);
    } catch (error) {
      console.error("Failed to fetch rating summary:", error);
      errorAlert("Failed to fetch rating summary.");
    }
  };

  useEffect(() => {
    fetchRatingSummary();
  }, [productId]);

  const refreshAll = async () => {
    setReviews([]);
    setPage(1);
    await fetchReviews(1, sortOrder);
    await fetchRatingSummary();
    setReviewTrigger(prev => prev + 1);
  };

  // 🧩 Fetch Paginated Reviews
  const fetchReviews = async (pageNum = 1, sort = sortOrder) => {
    if (!productId) return;
    setLoading(true);

    try {
      const response = await Api.get(
        `${
          import.meta.env.VITE_PRODUCT_REVIEW
        }/${productId}?page=${pageNum}&limit=4&sort=${sort}`
      );

      const { reviews: newReviews = [], totalPages = 1 } = response.data;

      setReviews((prev) => [
        ...prev,
        ...newReviews.filter((r) => !prev.some((p) => p._id === r._id)),
      ]);

      setTotalPages(totalPages);
    } catch (error) {
      console.error("❌ Failed to fetch reviews:", error);
      errorAlert("Failed to fetch reviews.");
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Toggle Reviews
  const handleShowReviews = async () => {
    if (!showReviews) {
      setPage(1);
      setReviews([]);
      await fetchReviews(1);
    }
    setShowReviews((prev) => !prev);
  };

  // 🪄 Infinite Scroll
  const lastReviewRef = useCallback(
    (node) => {
      if (loading) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && page < totalPages) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, page, totalPages]
  );

  useEffect(() => {
    if (page > 1) fetchReviews(page);
  }, [page]);

  // Sort Change
  const handleSortChange = async (e) => {
    const newSort = e.target.value;
    setSortOrder(newSort);
    setPage(1);
    setReviews([]);
    await fetchReviews(1, newSort);
  };

  // ⭐ Percentages
  const percentages = {};
  for (let i = 1; i <= 6; i++) {
    percentages[i] = totalRatings
      ? ((ratings[i] / totalRatings) * 100).toFixed(1)
      : 0;
  }

  const getGradientByRating = () => "bg-gray-900";
  const getStarColor = (rating) => {
    if (rating >= 5) return "text-emerald-400";
    if (rating >= 4) return "text-blue-400";
    if (rating >= 3) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="w-full bg-[#101010] text-gray-200 rounded-2xl py-10 px-8 shadow-xl border border-gray-800">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-yellow-400">
          Review Summary
        </h2>

        {!isReview && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1 text-yellow-400 hover:text-yellow-300 text-sm border border-yellow-500/30 rounded-md px-2 py-1 transition"
          >
            <Pencil size={15} /> Write Review
          </button>
        )}
      </div>

      {/* Modal */}
      <WriteReview
        showForm={showForm}
        setShowForm={setShowForm}
        productId={productId}
        refresh={refreshAll}
      />

      {/* Summary Row */}
      <div className="flex flex-col lg:flex-row gap-8 justify-between">
        {/* Rating Bars */}
        <div className="flex-1 space-y-3">
          {[6, 5, 4, 3, 2, 1].map((star) => {
            const getBarColor = (value) => {
              if (value <= 2) return "bg-red-500";
              if (value === 3) return "bg-yellow-500";
              if (value === 4) return "bg-blue-500";
              return "bg-green-500";
            };

            return (
              <div key={star} className="flex items-center gap-3">
                <span className="w-4 text-sm text-gray-400">{star}</span>

                <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentages[star]}%` }}
                    transition={{ duration: 0.6 }}
                    className={`h-3 rounded-full ${getBarColor(star)}`}
                  ></motion.div>
                </div>

                <span
                  className={`min-w-[40px] text-center text-xs font-semibold px-2 py-[2px] rounded-md border ${
                    star <= 2
                      ? "bg-red-500/20 text-red-400 border-red-500/30"
                      : star === 3
                      ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                      : star === 4
                      ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                      : "bg-green-500/20 text-green-400 border-green-500/30"
                  }`}
                >
                  {percentages[star]}%
                </span>
              </div>
            );
          })}
        </div>

        {/* Average Rating */}
        <div className="flex flex-col items-center justify-center min-w-[140px]">
          <p className="text-6xl font-bold text-white leading-tight drop-shadow-md">
            {averageRating.toFixed(1)}
          </p>

          <div className="flex justify-center gap-1 mb-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <Star
                key={i}
                size={22}
                className={`${
                  i < Math.round(averageRating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-600"
                }`}
              />
            ))}
          </div>

          <p className="text-sm text-gray-400">{totalRatings} reviews</p>
        </div>
      </div>

      {/* Toggle Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={handleShowReviews}
          className="flex items-center gap-2 text-sm text-yellow-400 font-medium hover:text-yellow-300 transition"
        >
          {showReviews ? (
            <>
              Hide Reviews
              <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              Show Reviews
              <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Reviews Section */}
      {showReviews && (
        <div className="mt-8">
          <div className="flex items-center   justify-end gap-3">
            {isReview && (
              <EditorDeleteReview productId={productId} refresh={refreshAll} />
            )}
            <div className="flex justify-end mb-4">
              <select
                value={sortOrder}
                onChange={handleSortChange}
                className="bg-gray-900 text-yellow-400 border border-gray-700 text-sm rounded-md px-3 py-2 focus:outline-none"
              >
                <option value="recent">Most Recent</option>
                <option value="high">Highest Rated</option>
                <option value="low">Lowest Rated</option>
              </select>
            </div>
          </div>

          {/* Scrollable Review Feed */}
          <div
            className="relative space-y-3 overflow-y-auto overflow-x-hidden pr-2 rounded-xl border border-gray-800 bg-[#0d0d0d]/80 shadow-inner px-2"
            style={{
              maxHeight: "420px",
              maskImage:
                "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
            }}
            onScroll={(e) => {
              const el = e.target;
              if (
                !loading &&
                page < totalPages &&
                el.scrollTop + el.clientHeight >= el.scrollHeight - 50
              ) {
                setPage((prev) => prev + 1);
              }
            }}
          >
            {/* No Reviews */}
            {reviews.length === 0 && !loading && (
              <div className="text-center py-10 text-gray-500">
                No reviews yet. Be the first to review 💬
              </div>
            )}

            <AnimatePresence mode="sync">
              {reviews.map((review, idx) => (
                <motion.div
                  key={review._id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.01 }}
                  className={`relative p-4 m-3 rounded-lg border border-gray-700/60 bg-gradient-to-br ${getGradientByRating()} hover:border-gray-500/50 transition-all duration-200`}
                >
                  <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                      <div className="flex items-center gap-2 mb-2 sm:mb-0">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 6 }).map((_, i) => (
                            <Star
                              key={i}
                              size={15}
                              className={`${
                                i < review.rating
                                  ? `${getStarColor(
                                      review.rating
                                    )} fill-current`
                                  : "text-gray-600"
                              }`}
                            />
                          ))}
                        </div>

                        <span className="text-xs font-medium text-gray-400">
                          {review.rating}.0
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm leading-relaxed mb-2">
                      {review.comment}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-700/40">
                      <p className="text-xs text-gray-400 italic">
                        – {review.userName || "Anonymous"}
                      </p>

                      <div
                        className={`flex items-center gap-1 text-xs px-2 py-[2px] rounded-full ${
                          review.rating >= 4
                            ? "bg-green-500/20 text-green-400"
                            : review.rating >= 3
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {review.rating >= 4 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loader */}
            {loading && (
              <div className="flex justify-center py-6">
                <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewSummary;
