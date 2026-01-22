import { useState } from "react";
import data from "../data/products";

import ProductTable from "../components/products/ProductTable";
import ProductFilters from "../components/products/ProductFilters";
import Pagination from "../components/products/Pagination";
import ProductForm from "../components/products/ProductForm";

const LIMIT = 20;

const Products = () => {
  const [products, setProducts] = useState(data);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);

  let filtered = products.filter(
    p =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (!category || p.category === category)
  );

  if (sort === "price-asc") filtered.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") filtered.sort((a, b) => b.price - a.price);

  const totalPages = Math.ceil(filtered.length / LIMIT);
  const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT);

  return (
    <div className="p-8  min-h-screen text-gray-200">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Products</h1>

      <div className="bg-gray-900 p-4 rounded-xl mb-4">
        <ProductForm onAdd={(p) => setProducts([p, ...products])} />
      </div>

      <div className="bg-gray-900 p-4 rounded-xl mb-4">
        <ProductFilters {...{ search, setSearch, sort, setSort, category, setCategory }} />
      </div>

      <div className="bg-gray-900 rounded-xl overflow-hidden">
        <ProductTable products={paginated} onDelete={(id) => setProducts(products.filter(p => p.id !== id))} />
      </div>

      <Pagination {...{ page, totalPages, setPage }} />
    </div>
  );
};

export default Products;
