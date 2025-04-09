const express = require('express');
const router = express.Router();
const { scrapeProduct } = require('../controllers/scraperController');
const { checkCompetitorPrices } = require('../controllers/scraperController');

// router.get('/product/:id/competitors', checkCompetitorPrices);


router.post('/scrape', scrapeProduct);

router.post('/product/:id/competitors', async (req, res) => {
    const { url } = req.body;
    const { id } = req.params;
    try {
      const product = await Product.findById(id);
      if (!product) return res.status(404).json({ message: 'Product not found' });
  
      product.competitors.push({ url });
      await product.save();
  
      res.status(200).json({ message: 'Competitor added', product });
    } catch (err) {
      res.status(500).json({ message: 'Error adding competitor', error: err.message });
    }
  });
  


module.exports = router;
