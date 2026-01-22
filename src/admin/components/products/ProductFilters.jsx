import Input from "../ui/Input";

const ProductFilters = ({ search, setSearch, sort, setSort, category, setCategory }) => (
  <div className="flex flex-wrap gap-3">
    <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />

    <select value={category} onChange={(e) => setCategory(e.target.value)}
      className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-200">
      <option value="">All Categories</option>
      <option>Electronics</option>
      <option>Fashion</option>
      <option>Books</option>
    </select>

    <select value={sort} onChange={(e) => setSort(e.target.value)}
      className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-200">
      <option value="">Sort</option>
      <option value="price-asc">Price ↑</option>
      <option value="price-desc">Price ↓</option>
    </select>
  </div>
);

export default ProductFilters;
