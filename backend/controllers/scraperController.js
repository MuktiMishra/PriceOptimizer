const axios = require('axios');
const cheerio = require('cheerio');
const Product = require('../models/Product');

exports.scrapeProduct = async (req, res) => {
  const { url } = req.body;

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // You need to customize these selectors based on the website
    const productName = $('h1').first().text().trim();
    const priceText = $('[class*="price"]').first().text().replace(/[^0-9]/g, '');
    const price = parseInt(priceText, 10);

    const product = new Product({
      productName,
      url,
      price,
    });

    await product.save();
    res.json({ message: 'Product scraped and saved', product });

  } catch (err) {
    res.status(500).json({ message: 'Scraping failed', error: err.message });
  }
};

// Helper to scrape price from a competitor URL (adjust selector as needed)
const extractPrice = async (url) => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // 👇 Adjust this selector based on site
    let priceText = $('span.a-price-whole').first().text().replace(/[^\d]/g, '');
    return parseFloat(priceText);
  } catch (error) {
    return null;
  }
};

exports.checkCompetitorPrices = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const prices = [];

    for (const competitor of product.competitors) {
      const price = await extractPrice(competitor.url);
      prices.push({ name: competitor.name, url: competitor.url, price });
    }

    res.status(200).json({
      productName: product.productName,
      basePrice: product.price,
      competitors: prices,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error checking competitor prices', error: err.message });
  }
};

  
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

  exports.getAllProducts = async (req, res) => {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch products', error: err.message });
    }
  };
  
  exports.updateProduct = async (req, res) => {
    try {
      const { productName, url, price } = req.body;
  
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        { productName, url, price, lastUpdated: Date.now() },
        { new: true }
      );
  
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      res.status(200).json({ message: 'Product updated', product: updatedProduct });
    } catch (err) {
      res.status(500).json({ message: 'Error updating product', error: err.message });
    }
  };

  // exports.addCompetitor = async (req, res) => {
  //   try {
  //     const { name, url } = req.body;
  
  //     const product = await Product.findById(req.params.id);
  //     if (!product) return res.status(404).json({ message: 'Product not found' });
  
  //     product.competitors.push({ name, url });
  //     product.lastUpdated = Date.now();
  //     await product.save();
  
  //     res.status(200).json({ message: 'Competitor added', product });
  //   } catch (err) {
  //     res.status(500).json({ message: 'Error adding competitor', error: err.message });
  //   }
  // };

  exports.addCompetitor = async (req, res) => {
    const { id } = req.params;
    const { name, url } = req.body;
  
    try {
      // Simulate scraping (replace with real scraping logic for your URLs)
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
  
      // Fake selector for demonstration — update based on real competitor site
      let priceText = $('span.price').text().replace(/[^0-9.]/g, '');
      let price = parseFloat(priceText);
  
      if (isNaN(price)) price = null;
  
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        {
          $push: {
            competitors: { name, url, price }
          },
          $set: { lastUpdated: new Date() }
        },
        { new: true }
      );
  
      res.status(200).json({ message: 'Competitor added & price scraped', product: updatedProduct });
    } catch (err) {
      res.status(500).json({ message: 'Failed to add competitor', error: err.message });
    }
  };

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};

  
  
  
