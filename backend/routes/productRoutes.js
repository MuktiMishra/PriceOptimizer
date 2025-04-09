const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// POST /api/product/:id/competitors
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
