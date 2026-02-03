import { useState, useEffect } from "react";
import Api from "../../utils/Api";
import ProductTable from "../components/products/ProductTable";
import ProductFilters from "../components/products/ProductFilters";
import Pagination from "../components/products/Pagination";
import ProductForm from "../components/products/ProductForm";
import Swal from "sweetalert2";
const LIMIT = 10;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);

  // Edit State
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: LIMIT,
        q: search || undefined,
        category: category || undefined,
        brand: brand || undefined,
      };

      const { data } = await Api.get(import.meta.env.VITE_PRODUCTSERVICE, {
        params,
      });

      
      const productsWithCategory = await Promise.all(
        data.products.map(async (product) => {
          try {
            const categoryRes = await Api.get(
              `${import.meta.env.VITE_CATEGORYSERVICE}/${product.category}`,
            );
            return {
              ...product,
              categoryName: categoryRes.data.name,
            };
          } catch {
            return {
              ...product,
              categoryName: "Uncategorized",
            };
          }
        }),
      );
      // console.log(productsWithCategory)
      
      setProducts(productsWithCategory);
      setTotalPages(data.pages);
    } catch (error) {
      // console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await Api.get(import.meta.env.VITE_CATEGORYSERVICE);
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, search, category, brand]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await Api.delete(`${import.meta.env.VITE_PRODUCTSERVICE}/${id}`);
      fetchProducts(); // Refresh
    } catch (error) {
      console.error("Delete failed", error);
      alert("Failed to delete product");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    // Assuming endpoint is update (PUT)

    try {
      
      await Api.put(`${import.meta.env.VITE_PRODUCTSERVICE}/${id}`, {
        isActive: !currentStatus,
      });
      fetchProducts();
    } catch (error) {
      console.error("Status update failed", error);
      alert("Failed to update status");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFormSubmit = () => {
    setEditingProduct(null); // Clear edit mode
    fetchProducts(); // Refresh list
  };

  return (
    <div className="p-8 min-h-screen text-gray-200">
      <h1 className="text-2xl font-bold p-4 text-[var(--accent-color)] mb-6">
        Products Management
      </h1>

      <div className="bg-gray-900 p-4 rounded-xl mb-4">
        <ProductForm
          initialData={editingProduct}
          categories={categories}
          onSuccess={handleFormSubmit}
          onCancel={() => setEditingProduct(null)}
        />
      </div>

      <div className="bg-gray-900 p-4 rounded-xl mb-4">
        <ProductFilters
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          categories={categories}
        />
      </div>

      <div className="bg-gray-900 rounded-xl overflow-hidden">
        {loading ? (
          <p className="p-4 text-center">Loading products...</p>
        ) : (
          <ProductTable
            products={products}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  );
};

export default Products;
