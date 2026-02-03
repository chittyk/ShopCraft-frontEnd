import Button from "../ui/Button";
import { CheckCircle, XCircle, Edit, Trash2 } from "lucide-react";

const ProductTable = ({ products, onDelete, onEdit, onToggleStatus }) => {
  return (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead className="bg-gray-900 text-gray-400">
        <tr>
          <th className="p-3 text-left">Name</th>
          <th className="text-left">Category</th>
          <th className="text-left">Price</th>
          <th className="text-left">Stock</th>
          <th className="text-center">Status</th>
          <th className="text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr
            key={p._id || p.id}
            className="border-t border-gray-800 hover:bg-gray-800/40"
          >
            <td className="p-3 font-medium text-gray-200">
              <div className="max-w-[220px] truncate" title={p.productName}>
                {p.productName}
              </div>
            </td>

            <td className="text-gray-400">
              <div className="max-w-[140px] truncate" title={p.categoryName}>
                {p.categoryName}
              </div>
            </td>

            <td className="text-green-400">₹{p.price}</td>

            <td className={`${p.stock < 5 ? "text-red-400" : "text-gray-300"}`}>
              {p.stock}
            </td>

            <td className="text-center">
              {p.isActive ? (
                <span className="text-green-500 flex justify-center items-center gap-1">
                  <CheckCircle size={14} /> Active
                </span>
              ) : (
                <span className="text-red-500 flex justify-center items-center gap-1">
                  <XCircle size={14} /> Disabled
                </span>
              )}
            </td>

            <td className="p-3 flex justify-center gap-2">
              <button
                type="button"
                onClick={() => onEdit(p)}
                className="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition"
              >
                <Edit size={16} />
              </button>

              <button
                type="button"
                onClick={() => onToggleStatus(p._id || p.id, p.isActive)}
                className={`p-2 rounded-lg transition ${
                  p.isActive
                    ? "bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30"
                    : "bg-green-600/20 text-green-400 hover:bg-green-600/30"
                }`}
              >
                {p.isActive ? <XCircle size={16} /> : <CheckCircle size={16} />}
              </button>

              <button
                type="button"
                onClick={() => onDelete(p._id || p.id)}
                className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition"
              >
                <Trash2 size={16} />
              </button>
            </td>
          </tr>
        ))}
        {products.length === 0 && (
          <tr>
            <td colSpan="6" className="p-4 text-center text-gray-500">
              No products found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
)
};

export default ProductTable;
