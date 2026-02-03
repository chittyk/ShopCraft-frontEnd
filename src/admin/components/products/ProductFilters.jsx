import Input from "../ui/Input";

const ProductFilters = ({ search, setSearch, sort, setSort, category, setCategory, categories = [] }) => (
  <div className="flex flex-wrap gap-3">
    <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />

    <select value={category} onChange={(e) => setCategory(e.target.value)}
      className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-gray-200">
      <option value="">All Categories</option>
      {categories.map(c => (
        <option key={c._id} value={c._id}>{c.name}</option>
      ))}
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
