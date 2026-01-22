import Button from "../ui/Button";

const ProductTable = ({ products, onDelete }) => (
  <table className="w-full text-sm">
    <thead className="bg-gray-900 text-gray-400">
      <tr>
        <th className="p-3">Name</th>
        <th>Category</th>
        <th>Price</th>
        <th>Stock</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {products.map((p) => (
        <tr key={p.id} className="border-t border-gray-800 hover:bg-gray-800/40">
          <td className="p-3">{p.name}</td>
          <td>{p.category}</td>
          <td>₹{p.price}</td>
          <td>{p.stock}</td>
          <td>
            <Button variant="danger" onClick={() => onDelete(p.id)}>Delete</Button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default ProductTable;
