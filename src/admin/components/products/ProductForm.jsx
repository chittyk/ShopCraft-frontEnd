import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { ChevronDown, ChevronUp, X, Save } from "lucide-react";
import ImageCropModal from "../ImageCropModal";
import Api from "../../../utils/Api";
/* ---------------- DEMO DATA ---------------- */
const CATEGORY_OPTIONS = [
  { id: "laptops", name: "Laptops" },
  { id: "mobiles", name: "Mobiles" },
  { id: "accessories", name: "Accessories" },
  { id: "audio", name: "Audio Devices" },
];

const BRAND_OPTIONS = [
  "Apple",
  "Samsung",
  "Dell",
  "HP",
  "Lenovo",
  "Asus",
];

const TAG_LIMIT = 8;
const FEATURE_LIMIT = 10;

const ProductForm = ({ onAdd }) => {
  const [open, setOpen] = useState(true);

  /* ---------------- IMAGE STATES ---------------- */
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [tempImage, setTempImage] = useState(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [imageType, setImageType] = useState(null);

  /* ---------------- FORM STATE ---------------- */
  const [form, setForm] = useState({
    productName: "",
    description: "",
    price: "",
    oldPrice: "",
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

  /* ---------------- VALIDATION ---------------- */
  const validate = () => {
    const e = {};

    if (!form.productName.trim() || form.productName.length < 3)
      e.productName = "Minimum 3 characters";

    if (!form.description.trim() || form.description.length < 10)
      e.description = "Minimum 10 characters";

    if (!form.brand) e.brand = "Brand required";
    if (!form.category) e.category = "Category required";

    if (!form.price || Number(form.price) <= 0)
      e.price = "Price must be > 0";

    if (!form.oldPrice || Number(form.oldPrice) < Number(form.price))
      e.oldPrice = "Old price must be ≥ price";

    if (form.stock === "" || Number(form.stock) < 0)
      e.stock = "Invalid stock";

    if (!thumbnailFile) e.thumbnail = "Thumbnail required";

    if (form.tags.length < 3 || form.tags.length > TAG_LIMIT)
      e.tags = `3–${TAG_LIMIT} tags required`;

    if (form.features.length < 3 || form.features.length > FEATURE_LIMIT)
      e.features = `3–${FEATURE_LIMIT} features required`;

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ---------------- TAG / FEATURE ---------------- */
  const addItem = (value, key, setter, limit) => {
    const clean = value.trim().toLowerCase();
    if (!clean || form[key].includes(clean) || form[key].length >= limit) return;
    setForm(prev => ({ ...prev, [key]: [...prev[key], clean] }));
    setter("");
  };

  const removeItem = (i, key) => {
    setForm(prev => ({ ...prev, [key]: prev[key].filter((_, idx) => idx !== i) }));
  };

  const removeGalleryImage = (i) => {
    setGalleryFiles(prev => prev.filter((_, idx) => idx !== i));
  };

  /* ---------------- IMAGE HANDLERS ---------------- */
  const openCrop = (file, type) => {
    setTempImage(URL.createObjectURL(file));
    setImageType(type);
    setCropOpen(true);
  };

  const saveCroppedImage = (file) => {
    if (imageType === "thumbnail") {
      setThumbnailFile(file);
    } else {
      setGalleryFiles(prev => [...prev, file]);
    }
  };

  /* ---------------- SUBMIT ---------------- */
  const [loading, setLoading] = useState(false);

  /* ---------------- SUBMIT ---------------- */
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await Api.post(
        `${import.meta.env.VITE_PRODUCTSERVICE}/upload-image`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data.imageUrl;
    } catch (error) {
      console.error("Image upload failed:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      let thumbnailUrl = "";
      const galleryUrls = [];

      // 1. Upload Thumbnail
      if (thumbnailFile) {
        thumbnailUrl = await uploadImage(thumbnailFile);
      }

      // 2. Upload Gallery Images
      if (galleryFiles.length > 0) {
        const results = await Promise.all(
          galleryFiles.map((file) => uploadImage(file))
        );
        galleryUrls.push(...results);
      }

      // 3. Calculate Discount
      const priceVal = Number(form.price);
      const oldPriceVal = Number(form.oldPrice);
      let calculatedOff = 0;
      if (oldPriceVal > priceVal && oldPriceVal > 0) {
        calculatedOff = Math.round(((oldPriceVal - priceVal) / oldPriceVal) * 100);
      }

      // 4. Create Payload
      const payload = {
        ...form,
        price: priceVal,
        stock: Number(form.stock),
        off: calculatedOff,
        thumbnail: thumbnailUrl,
        images: galleryUrls,
        tags: form.tags,
        features: form.features,
      };

      const response = await Api.post(
        `${import.meta.env.VITE_PRODUCTSERVICE}`,
        payload
      );

      console.log("Product created:", response.data);
      onAdd?.(response.data.product); // optional callback
      
      // Optional: Reset form or show success message
      setOpen(false);

    } catch (error) {
      console.error("Create product failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="div-bg border border-gray-700 rounded-xl overflow-hidden">

      {/* HEADER */}
      <div
        className="flex justify-between items-center px-4 py-3 bg-[#0b0f1a] cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <h2 className="text-lg font-semibold text-gray-200">Add Product</h2>
        {open ? <ChevronUp /> : <ChevronDown />}
      </div>

      {open && (
        <form onSubmit={handleSubmit} className="p-4 space-y-6">

          {/* ---------- IMAGES ---------- */}
          <div className="grid grid-cols-2 gap-6">

            {/* THUMBNAIL */}
            <div>
              <p className="text-gray-300 mb-2">Thumbnail</p>
              <input
                type="file"
                accept="image/*"
                onChange={e => openCrop(e.target.files[0], "thumbnail")}
                className="w-full div-bg border border-gray-700 rounded-lg px-3 py-2"
              />
              {errors.thumbnail && (
                <p className="text-red-400 text-sm">{errors.thumbnail}</p>
              )}

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

            {/* GALLERY */}
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
                  <div
                    key={i}
                    className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-700"
                  >
                    <img
                      src={URL.createObjectURL(img)}
                      className="w-full h-full object-cover"
                    />
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

          {/* CROP MODAL */}
          {cropOpen && (
            <ImageCropModal
              image={tempImage}
              onClose={() => setCropOpen(false)}
              onCropDone={saveCroppedImage}
            />
          )}

          {/* ---------- BASIC INFO ---------- */}
          <div className="grid grid-cols-3 gap-4">
            <Input
              placeholder="Product Name"
              value={form.productName}
              onChange={e => setForm({ ...form, productName: e.target.value })}
            />

            {/* BRAND DROPDOWN */}
            <select
              className="w-full div-bg border border-gray-700 rounded-lg px-3 py-2"
              value={form.brand}
              onChange={e => setForm({ ...form, brand: e.target.value })}
            >
              <option value="">Select Brand</option>
              {BRAND_OPTIONS.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>

            {/* CATEGORY DROPDOWN */}
            <select
              className="w-full div-bg border border-gray-700 rounded-lg px-3 py-2"
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
            >
              <option value="">Select Category</option>
              {CATEGORY_OPTIONS.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <Input type="number" placeholder="Price"
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
            />
            <Input type="number" placeholder="Old Price"
              value={form.oldPrice}
              onChange={e => setForm({ ...form, oldPrice: e.target.value })}
            />
            <Input type="number" placeholder="Stock"
              value={form.stock}
              onChange={e => setForm({ ...form, stock: e.target.value })}
            />
          </div>

          {/* ---------- TAGS ---------- */}
          <div>
            <Input
              placeholder="Add tag & Enter"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e =>
                e.key === "Enter" &&
                (e.preventDefault(), addItem(tagInput, "tags", setTagInput, TAG_LIMIT))
              }
            />
            <div className="flex gap-2 mt-2">
              {form.tags.map((t, i) => (
                <span key={i} className="px-3 py-1 bg-gray-700 rounded-full text-sm flex gap-1">
                  {t}
                  <X size={14} onClick={() => removeItem(i, "tags")} />
                </span>
              ))}
            </div>
          </div>

          {/* ---------- FEATURES ---------- */}
          <div>
            <Input
              placeholder="Add feature & Enter"
              value={featureInput}
              onChange={e => setFeatureInput(e.target.value)}
              onKeyDown={e =>
                e.key === "Enter" &&
                (e.preventDefault(), addItem(featureInput, "features", setFeatureInput, FEATURE_LIMIT))
              }
            />
            <div className="flex gap-2 mt-2">
              {form.features.map((f, i) => (
                <span key={i} className="px-3 py-1 bg-gray-600 rounded-full text-sm flex gap-1">
                  {f}
                  <X size={14} onClick={() => removeItem(i, "features")} />
                </span>
              ))}
            </div>
          </div>

          {/* ---------- DESCRIPTION ---------- */}
          <textarea
            placeholder="Description"
            className="w-full div-bg border border-gray-700 rounded-lg px-3 py-2"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />

          {/* ---------- EXTRA NOTE ---------- */}
          <textarea
            placeholder="Extra Note (optional)"
            className="w-full div-bg border border-gray-700 rounded-lg px-3 py-2"
            value={form.extraNote}
            onChange={e => setForm({ ...form, extraNote: e.target.value })}
          />

          {/* ---------- ACTION ---------- */}
          <div className="flex justify-end">
            <Button disabled={loading}>
              {loading ? "Adding Product..." : "Add Product"}
            </Button>
          </div>

        </form>
      )}
    </div>
  );
};

export default ProductForm;
