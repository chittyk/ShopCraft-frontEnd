import axios from "axios";
import { useEffect, useState } from "react";

export default function CategoryBar() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8082/api/category");

        if (response.status === 200 && Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          console.error("Unexpected API response:", response.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const visibleCategories = showAll ? categories : categories.slice(0, 7);
  const remainingCount = categories.length - 7;

  // 🌀 Loading Spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-gray-700"></div>
        <p className="ml-3 text-gray-600 text-lg">Loading categories...</p>
      </div>
    );
  }

  // 🧩 No Categories Case
  if (!loading && categories.length === 0) {
    return (
      <div className="text-gray-500 text-lg text-center py-10">
        No categories found.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-6">
      {/* Category Grid */}
      <div
        className={`grid gap-4 transition-all duration-500 ease-in-out
        grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8`}
      >
        {visibleCategories.map((cat) => (
          <div
  key={cat._id || cat.id}
  onClick={() => setActiveCategory(cat._id || cat.id)}
  title={cat.description}
  className={`flex items-center justify-center text-center px-4 py-3 rounded-2xl cursor-pointer font-medium shadow-md 
    transition-all duration-200 ease-in-out select-none min-h-[60px]
    ${
      activeCategory === (cat._id || cat.id)
        ? "bg-blue-600 text-white scale-105 shadow-lg"
        : "bg-gray-800 text-gray-100 hover:bg-gray-700 hover:shadow-md hover:scale-105"
    }`}
>
  <span className="whitespace-normal break-words leading-snug">{cat.name}</span>
</div>

        ))}

        {/* +N button */}
        {!showAll && remainingCount > 0 && (
          <button
            onClick={() => setShowAll(true)}
            className="p-3 bg-gray-600 text-white text-center rounded-xl font-semibold hover:bg-gray-500 transition"
          >
            +{remainingCount}
          </button>
        )}
      </div>

      {/* Show Less */}
      {showAll && (
        <button
          onClick={() => setShowAll(false)}
          className="mt-6 px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
        >
          Show Less
        </button>
      )}
    </div>
  );
}
