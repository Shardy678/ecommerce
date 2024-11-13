const mongoose = require("mongoose");
const Product = require("./models/Product");
mongoose.connect("mongodb://127.0.0.1:27017/test");

const products = [
  new Product({
    name: "Smartphone XYZ",
    description:
      "Latest model smartphone with a stunning display and powerful performance.",
    price: 699.99,
    category: "Electronics",
  }),
  new Product({
    name: "4K Ultra HD Smart TV",
    description:
      "Experience stunning picture quality with this 4K Ultra HD Smart TV.",
    price: 999.99,
    category: "Electronics",
  }),
  new Product({
    name: "Gaming Laptop",
    description:
      "High-performance gaming laptop with a powerful GPU and fast refresh rate.",
    price: 1299.99,
    category: "Computers",
  }),
  new Product({
    name: "Wireless Mouse",
    description:
      "Ergonomic wireless mouse with customizable buttons and long battery life.",
    price: 29.99,
    category: "Accessories",
  }),
];

Product.insertMany(products)
  .then(() => {
    console.log("Products saved successfully!");
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error("Error saving products:", error);
    mongoose.connection.close();
  });
