const products = Array.from({ length: 57 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  category: ["Electronics", "Fashion", "Books"][i % 3],
  price: Math.floor(Math.random() * 5000) + 500,
  stock: i % 5 === 0 ? 0 : Math.floor(Math.random() * 100),
}));

export default products;
