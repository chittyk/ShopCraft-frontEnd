import React, { useEffect, useState } from "react";
import Api from "../../../utils/Api";
import WriteReview from "./writeRivew";
import { successAlert, errorAlert } from "../../../utils/Alert";

function EditorDeleteReview({ productId, refresh }) {
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [id, setId] = useState(null); // review _id

  // ⬇ Fetch user's review for this product
  useEffect(() => {
    const isReview = async () => {
      try {
        const res = await Api.get(
          `${import.meta.env.VITE_PRODUCT_REVIEW}/getOneReview/${productId}`
        );

        setRating(res.data.rating);
        setComment(res.data.comment);
        setId(res.data._id); // review id
      } catch (error) {
        console.log("Failed to fetch user review:", error);
      }
    };

    isReview();
  }, [productId]);

  // ⬇ Delete review handler
  const handleDelete = async () => {
    if (!id) return errorAlert("No review found to delete!");

    try {
      await Api.delete(`${import.meta.env.VITE_PRODUCT_REVIEW}/${id}`);

      successAlert("Review deleted successfully!");
      refresh(); // refresh review list
    } catch (error) {
      errorAlert("Failed to delete review.");
      console.log(error);
    }
  };

  return (
    <div className="flex gap-3 justify-end mb-4">
      {/* Edit Btn */}
      <button
        onClick={() => setShowForm(true)}
        className="bg-gray-900 text-yellow-400 border border-gray-700 text-sm rounded-md px-3 py-2 focus:outline-none"
      >
        Edit My Review
      </button>

      {/* Delete Btn */}
      <button
        onClick={handleDelete}
        className="bg-gray-900 text-yellow-400 border border-gray-700 text-sm rounded-md px-3 py-2 focus:outline-none"
      >
        Delete My Review
      </button>

      {/* Edit Review Modal */}
      {showForm && (
        <WriteReview
          showForm={showForm}
          setShowForm={setShowForm}
          productId={id} // review _id
          oldRating={rating}
          oldComment={comment}
          isUpdate={true}
          refresh={refresh}
        />
      )}
    </div>
  );
}

export default EditorDeleteReview;
