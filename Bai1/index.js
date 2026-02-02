//Câu 1
function Product(id, name, price, quantity, category, isAvailable) {
  this.id = id;
  this.name = name;
  this.price = price;
  this.quantity = quantity;
  this.category = category;
  this.isAvailable = isAvailable;
}

//Câu 2
const products = [
  new Product(1, "iPhone 16 ProMax", 31000000, 15, "Electronics", true),
  new Product(2, "Samsung Galaxy S24", 22000000, 8, "Electronics", true),
  new Product(3, "MacBook Pro M3", 45000000, 5, "Electronics", true),
  new Product(4, "Áo thun nam", 250000, 0, "Fashion", false)
];

//Câu 3
const productNamePrice = products.map(product => ({
  name: product.name,
  price: product.price
}));
console.log(productNamePrice);

//Câu 4
const inStockProducts = products.filter(product => product.quantity > 0);
console.log(inStockProducts);

//Câu 5
const hasExpensiveProduct = products.some(product => product.price > 30000000);
console.log(hasExpensiveProduct);

//Câu 6
const allAccessoriesAvailable = products
  .filter(product => product.category === "Accessories")
  .every(product => product.isAvailable === true);
console.log(allAccessoriesAvailable);

//Câu 7
const totalInventoryValue = products.reduce((total, product) => {
  return total + (product.price * product.quantity);
}, 0);
console.log(`${totalInventoryValue.toLocaleString('vi-VN')} VNĐ`);

//Câu 8
for (const product of products) {
  const status = product.isAvailable ? "Đang bán" : "Hết hàng";
  console.log(`${product.name} - ${product.category} - ${status}`);
}

// Câu 9
const sampleProduct = products[0];
for (const key in sampleProduct) {
  console.log(`${key}: ${sampleProduct[key]}`);
}

// Câu 10
const availableProductNames = products
  .filter(product => product.isAvailable && product.quantity > 0)
  .map(product => product.name);
console.log(availableProductNames);