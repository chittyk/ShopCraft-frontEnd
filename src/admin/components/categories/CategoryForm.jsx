import { useEffect, useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Api from "../../../utils/Api";

const CategoryForm = ({ initialData, onSuccess, onCancel }) => {
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setIsActive(initialData.isActive);
    } else {
      setName("");
      setIsActive(true);
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Category name required");

    setLoading(true);
    try {
      if (initialData) {
        await Api.put(`${import.meta.env.VITE_CATEGORYSERVICE}/${initialData._id}`, {
          name,
          isActive,
        });
        alert("✅ Category updated");
      } else {
        await Api.post(import.meta.env.VITE_CATEGORYSERVICE, {
          name,
          isActive,
        });
        alert("✅ Category created");
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("❌ Category save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="div-bg border border-gray-700 rounded-xl p-4 space-y-4"
    >
      <h2 className="text-lg text-gray-200 font-semibold">
        {initialData ? "Edit Category" : "Add Category"}
      </h2>

      <Input
        placeholder="Category Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label className="flex items-center gap-2 text-gray-300">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        Active
      </label>

      <div className="flex justify-end gap-3">
        {initialData && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button disabled={loading}>
          {loading ? "Saving..." : initialData ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
