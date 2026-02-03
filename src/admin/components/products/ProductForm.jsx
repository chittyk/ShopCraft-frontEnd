import { useState, useEffect } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { ChevronDown, ChevronUp, X, Save } from "lucide-react";
import ImageCropModal from "../ImageCropModal";
import Api from "../../../utils/Api";
import axios from "axios";
import { getToken } from "../../../utils/auth";

/* ---------------- BRAND OPTIONS ---------------- */
const BRAND_OPTIONS = [
  { id: "Apple", name: "Apple" },
  { id: "Samsung", name: "Samsung" },
  { id: "Dell", name: "Dell" },
  { id: "HP", name: "HP" },
  { id: "Lenovo", name: "Lenovo" },
  { id: "Asus", name: "Asus" },
];


const TAG_LIMIT = 8;
const FEATURE_LIMIT = 10;

const ProductForm = ({ onAdd, initialData, onSuccess, onCancel, categories = [] }) => {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  /* ---------------- IMAGE STATES ---------------- */
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [existingThumbnail, setExistingThumbnail] = useState("");
  const [existingGallery, setExistingGallery] = useState([]);
  const [tempImage, setTempImage] = useState(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [imageType, setImageType] = useState(null);
  const [errVal, setErrVal] = useState("");

  /* ---------------- FORM STATE ---------------- */
  const [form, setForm] = useState({
    
    productName: "",
    description: "",
    price: "",
    off: 0,
    stock: "",
    brand: "",
    category: "",
    tags: [],
    features: [],
    isActive: true,
    isPremium: false,
    extraNote: "",
  });

  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [isDirty, setIsDirty] = useState(false); // Track if user has interacted

  /* ---------------- EDIT MODE ---------------- */

  

  useEffect(() => {
    if (!initialData) return;

    setForm({
      productName: initialData.productName || "",
      description: initialData.description || "",
      price: initialData.price || "",
      off: initialData.off || 0,
      stock: initialData.stock || "",
      brand: initialData.brand || "",
      category: initialData.category || "65af9e4c8f1a2b3c4d5e6f70",
      tags: initialData.tags || [],
      features: initialData.features || [],
      isActive: initialData.isActive ?? true,
      isPremium: initialData.isPremium ?? false,
      extraNote: initialData.extraNote || "",
    });

    setExistingThumbnail(initialData.thumbnail || "");
    setExistingGallery(initialData.images || []);
  }, [initialData]);

  /* ---------------- LIVE VALIDATION LOGIC ---------------- */
  const validate = () => {
    const e = {};

    if (!form.productName || form.productName.length < 3)
      e.productName = "Minimum 3 characters";

    if (!form.description || form.description.length < 10)
      e.description = "Minimum 10 characters";

    if (!form.price || Number(form.price) <= 0)
      e.price = "Invalid price";

    if (form.off < 0 || form.off > 100)
      e.off = "Discount must be 0–100%";

    if (form.stock === "" || Number(form.stock) < 0)
      e.stock = "Invalid stock";

    if (!form.brand) e.brand = "Brand required";
    if (!form.category) e.category = "Category required";

    if (form.tags.length < 1) e.tags = "At least 1 tag required";
    if (form.tags.length > TAG_LIMIT) e.tags = `Maximum ${TAG_LIMIT} tags`;

    if (form.features.length < 1) e.features = "At least 1 feature required";
    if (form.features.length > FEATURE_LIMIT) e.features = `Maximum ${FEATURE_LIMIT} features`;

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Run validation whenever form changes
  useEffect(() => {
    if (isDirty) {
      validate();
    }
  }, [form]);

  const handleInputChange = (updates) => {
    setIsDirty(true);
    setForm(prev => ({ ...prev, ...updates }));
  };

  /* ---------------- TAG / FEATURE ---------------- */
  const addItem = (value, key, setter, limit) => {
    const clean = value.trim().toLowerCase();
    if (!clean || form[key].includes(clean) || form[key].length >= limit) return;
    setIsDirty(true);
    setForm(prev => ({ ...prev, [key]: [...prev[key], clean] }));
    setter("");
  };

  const removeItem = (i, key) => {
    setIsDirty(true);
    setForm(prev => ({
      ...prev,
      [key]: prev[key].filter((_, idx) => idx !== i),
    }));
  };

  const removeGalleryImage = (i) => {
    setGalleryFiles(prev => prev.filter((_, idx) => idx !== i));
  };

  const removeExistingGalleryImage = (i) => {
    setExistingGallery(prev => prev.filter((_, idx) => idx !== i));
  };

  /* ---------------- IMAGE CROP ---------------- */
  const openCrop = (file, type) => {
    setTempImage(URL.createObjectURL(file));
    setImageType(type);
    setCropOpen(true);
  };

  const saveCroppedImage = (file) => {
    if (imageType === "thumbnail") setThumbnailFile(file);
    else setGalleryFiles(prev => [...prev, file]);
  };

  /* ---------------- IMAGE UPLOAD ---------------- */
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const token = getToken();

    const res = await axios.post(
      `${import.meta.env.VITE_PRODUCTSERVICE}/upload-image`,
      formData,
      {
        headers: {
          Authorization: token ? `token ${token}` : "",
        },
      }
    );

    return res.data.imageUrl;
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsDirty(true);
    if (!validate()) return setErrVal("Validation failed !!");

    setLoading(true);

    try {
      let thumbnail = existingThumbnail;
      let images = [...existingGallery];

      if (thumbnailFile) thumbnail = await uploadImage(thumbnailFile);

      if (galleryFiles.length) {
        const uploaded = await Promise.all(galleryFiles.map(uploadImage));
        images.push(...uploaded);
      }

      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        off: Number(form.off),
        thumbnail,
        images,
      };

      const url = initialData
        ? `${import.meta.env.VITE_PRODUCTSERVICE}/${initialData._id}`
        : import.meta.env.VITE_PRODUCTSERVICE;

      const response = initialData
        ? await Api.put(url, payload)
        : await Api.post(url, payload);

      alert("✅ Product saved successfully");

      onSuccess?.(response.data.product);
      onAdd?.(response.data.product);
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.msg ||
        err.message ||
        "❌ Product submission failed"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="div-bg border border-gray-700 rounded-xl overflow-hidden">
      <div
        className="flex justify-between items-center px-4 py-3 bg-[#0b0f1a] cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <h2 className="text-lg font-semibold text-gray-200">Add Product</h2>
        {open ? <ChevronUp /> : <ChevronDown />}
      </div>
      <h1 className=" text-2xl text-amber-400 text-center">{errVal}</h1>
      {open && (
        <form onSubmit={handleSubmit} className="p-4 space-y-6">

          {/* ---------- IMAGES ---------- */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-gray-300 mb-2">Thumbnail</p>
              <input
                type="file"
                accept="image/*"
                onChange={e => openCrop(e.target.files[0], "thumbnail")}
                className="w-full div-bg border border-gray-700 rounded-lg px-3 py-2"
              />
              {thumbnailFile && (
                <div className="mt-3 flex items-center gap-3">
                  <img
                    src={URL.createObjectURL(thumbnailFile)}
                    className="w-24 h-24 rounded-lg object-cover border border-gray-700"
                  />
                  <span className="flex items-center gap-1 text-sm px-3 py-2 bg-gray-700 rounded-lg">
                    <Save size={14} /> Saved
                  </span>
                </div>
              )}
            </div>

            <div>
              <p className="text-gray-300 mb-2">Gallery Images</p>
              <input
                type="file"
                accept="image/*"
                onChange={e => openCrop(e.target.files[0], "gallery")}
                className="w-full div-bg border border-gray-700 rounded-lg px-3 py-2"
              />
              <div className="flex flex-wrap gap-3 mt-3">
                {galleryFiles.map((img, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-700">
                    <img src={URL.createObjectURL(img)} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(i)}
                      className="absolute top-1 right-1 bg-black/70 rounded-full p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {cropOpen && (
            <ImageCropModal
              image={tempImage}
              onClose={() => setCropOpen(false)}
              onCropDone={saveCroppedImage}
            />
          )}

          {/* ---------- BASIC INFO ---------- */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Input placeholder="Product Name" value={form.productName}
                onChange={e => handleInputChange({ productName: e.target.value })} />
              {errors.productName && <p className="text-red-500 text-xs mt-1">{errors.productName}</p>}
            </div>

            <div>
              <select className="w-full div-bg border border-gray-700 rounded-lg px-3 py-2 text-gray-300"
                value={form.brand}
                onChange={e => handleInputChange({ brand: e.target.value })}>
                <option value="">Select Brand</option>
                {BRAND_OPTIONS.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
              {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand}</p>}
            </div>

            <div>
              <select className="w-full div-bg border border-gray-700 rounded-lg px-3 py-2 text-gray-300"
                value={form.category}
                onChange={e => handleInputChange({ category: e.target.value })}>
                <option value="">Select Category</option>
                {categories.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>

            <div>
              <Input type="number" placeholder="Price" value={form.price}
                onChange={e => handleInputChange({ price: e.target.value })} />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>

            <div>
              <Input type="number" placeholder="Discount (%)" value={form.off}
                onChange={e => handleInputChange({ off: e.target.value })} />
              {errors.off && <p className="text-red-500 text-xs mt-1">{errors.off}</p>}
            </div>

            <div>
              <Input type="number" placeholder="Stock" value={form.stock}
                onChange={e => handleInputChange({ stock: e.target.value })} />
              {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
            </div>
          </div>

          {/* ---------- TAGS ---------- */}
          <div>
            <Input placeholder="Add tag & Enter" value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addItem(tagInput, "tags", setTagInput, TAG_LIMIT))} />
            {errors.tags && <p className="text-red-500 text-xs mt-1">{errors.tags}</p>}
            <div className="flex flex-wrap gap-2 mt-2">
              {form.tags.map((t, i) => (
                <span key={i} className="px-3 py-1 bg-gray-700 rounded-full text-sm flex items-center gap-1 text-gray-200">
                  {t}<X size={14} className="cursor-pointer" onClick={() => removeItem(i, "tags")} />
                </span>
              ))}
            </div>
          </div>

          {/* ---------- FEATURES ---------- */}
          <div>
            <Input placeholder="Add feature & Enter" value={featureInput}
              onChange={e => setFeatureInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addItem(featureInput, "features", setFeatureInput, FEATURE_LIMIT))} />
            {errors.features && <p className="text-red-500 text-xs mt-1">{errors.features}</p>}
            <div className="flex flex-wrap gap-2 mt-2">
              {form.features.map((f, i) => (
                <span key={i} className="px-3 py-1 bg-gray-600 rounded-full text-sm flex items-center gap-1 text-gray-200">
                  {f}<X size={14} className="cursor-pointer" onClick={() => removeItem(i, "features")} />
                </span>
              ))}
            </div>
          </div>

          <div>
            <textarea placeholder="Description" className="w-full div-bg border border-gray-700 rounded-lg px-3 py-2 text-gray-300"
              rows={3}
              value={form.description} onChange={e => handleInputChange({ description: e.target.value })} />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          <textarea placeholder="Extra Note (optional)" className="w-full div-bg border border-gray-700 rounded-lg px-3 py-2 text-gray-300"
            rows={2}
            value={form.extraNote} onChange={e => handleInputChange({ extraNote: e.target.value })} />

          <div className="flex justify-end">
            <Button disabled={loading}>
              {loading ? "Saving..." : initialData ? "Update Product" : "Add Product"}
            </Button>
          </div>

        </form>
      )}
    </div>
  );
};

export default ProductForm;