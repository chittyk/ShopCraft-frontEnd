import React, { useEffect, useRef, useState } from "react";
import ProductCard from "./ProductCard";
import Api from "../../utils/Api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef(null);
  const limit = 9; // how many products per page

  // 🔹 Fetch Products Function
  const fetchProducts = async (pageNumber) => {
    try {
      setLoading(true);
      const response = await Api.get(
        `${import.meta.env.VITE_PRODUCTSERVICE}?page=${pageNumber}&limit=${limit}`
      );
      const data = response.data;

      if (!data.products || data.products.length === 0) {
        setHasMore(false);
        return;
      }

      setProducts((prev) => [...prev, ...data.products]); // append new products
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Initial + On Page Change
  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  // 🔹 Intersection Observer for Infinite Scroll
  useEffect(() => {
    if (loading) return;
    if (observerRef.current) observerRef.current.disconnect();

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          console.log("⏬ Loading more products...");
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    const lastProduct = document.querySelector("#load-more-trigger");
    if (lastProduct) observer.observe(lastProduct);
    observerRef.current = observer;

    return () => observer.disconnect();
  }, [loading, hasMore]);

  // 🟡 Loading / Error states
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );

  // 🟢 Render UI
  return (
    <div className="min-h-screen w-full py-10 px-6 bg-gray-900">
      <h1 className="text-3xl font-bold text-[var(--accent-color)] text-center mb-8">
        Our Products
      </h1>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length > 0 ? (
          products.map((product, idx) => (
            <ProductCard key={product._id || idx} product={product} />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No products available
          </p>
        )}
      </div>

      {/* Infinite Scroll Trigger */}
      {hasMore && !loading && (
        <div id="load-more-trigger" className="h-10 mt-10"></div>
      )}

      {/* Loader Spinner */}
      {loading && (
        <div className="flex justify-center items-center mt-6">
          <div className="w-8 h-8 border-4 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* No More Products */}
      {!hasMore && (
        <p className="text-center text-gray-500 mt-6">
            You’ve reached the end!
        </p>
      )}
    </div>
  );
};

export default Products;
