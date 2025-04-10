const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// POST /api/product/:id/competitors

const Product = require('../models/Product');

// @desc   Add a new product
// @route  POST /api/product
// @access Public or Protected (based on your setup)
exports.addProduct = async (req, res) => {
  try {
    const { productName, url, price, competitors } = req.body;

    // Basic validation
    if (!productName) {
      return res.status(400).json({ message: 'Product name is required' });
    }

    const newProduct = new Product({
      productName,
      url,
      price,
      competitors, // optional array of competitor objects
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', product: savedProduct });

  } catch (error) {
    res.status(500).json({ message: 'Error adding product', error: error.message });
  }
};

router.post('/product/:id/competitors', async (req, res) => {
  const { id } = req.params;
  const { name, url } = req.body;

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.competitors.push({ name, url });
    await product.save();

    res.status(200).json({ message: 'Competitor added successfully', product });
  } catch (err) {
    res.status(500).json({ message: 'Error adding competitor', error: err.message });
  }
});

module.exports = router;
