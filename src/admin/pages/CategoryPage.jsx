import { useEffect, useState } from "react";
import CategoryForm from "../components/categories/CategoryForm";

import Api from "../../utils/Api";
import CategoryTable from "../components/categories/CategoryTable";
CategoryTable
const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await Api.get(import.meta.env.VITE_CATEGORYSERVICE);
      setCategories(res.data.categories || res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSuccess = () => {
    setEditingCategory(null);
    fetchCategories();
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-200">
        Category Management
      </h1>

      <CategoryForm
        initialData={editingCategory}
        onSuccess={handleSuccess}
        onCancel={() => setEditingCategory(null)}
      />

      <CategoryTable
        categories={categories}
        onEdit={setEditingCategory}
        onRefresh={fetchCategories}
      />
    </div>
  );
};

export default CategoryPage;
