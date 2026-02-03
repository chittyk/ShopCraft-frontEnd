import { Edit, Trash2 } from "lucide-react";
import Api from "../../../utils/Api";

const CategoryTable = ({ categories, onEdit, onRefresh }) => {
  const deleteCategory = async (id) => {
    if (!confirm("Delete this category?")) return;

    try {
      await Api.delete(`${import.meta.env.VITE_CATEGORYSERVICE}/${id}`);
      alert("🗑 Category deleted");
      onRefresh();
    } catch (err) {
      console.error(err);
      alert("❌ Delete failed");
    }
  };

  return (
    <div className="div-bg border border-gray-700 rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-[#0b0f1a]">
          <tr className="text-gray-400 text-sm">
            <th className="p-3 text-left">Name</th>
            <th className="p-3">Status</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((cat) => (
            <tr
              key={cat._id}
              className="border-t border-gray-700 hover:bg-gray-800"
            >
              <td className="p-3 text-gray-200">{cat.name}</td>
              <td className="p-3 text-center">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    cat.isActive
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white"
                  }`}
                >
                  {cat.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="p-3 flex justify-center gap-3">
                <button onClick={() => onEdit(cat)}>
                  <Edit size={18} />
                </button>
                <button onClick={() => deleteCategory(cat._id)}>
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;
