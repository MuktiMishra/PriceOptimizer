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

exports.checkCompetitorPrices = async (req, res) => {
    const { id } = req.params;
  
    try {
      const product = await Product.findById(id);
      if (!product || !product.competitors.length) {
        return res.status(404).json({ message: 'Product or competitors not found' });
      }
  
      const axios = require('axios');
      const cheerio = require('cheerio');
  
      const results = await Promise.all(
        product.competitors.map(async (comp) => {
          try {
            const { data } = await axios.get(comp.url);
            const $ = cheerio.load(data);
            const priceText = $('[class*="price"]').first().text().replace(/[^0-9]/g, '');
            const price = parseInt(priceText, 10);
            return { name: comp.name, url: comp.url, price };
          } catch (err) {
            return { name: comp.name, url: comp.url, price: null, error: 'Failed to scrape' };
          }
        })
      );
  
      res.json({ productName: product.productName, yourPrice: product.price, competitors: results });
    } catch (err) {
      res.status(500).json({ message: 'Error checking competitor prices', error: err.message });
    }
  };
  
