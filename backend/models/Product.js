const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },   // Your product's name
  url: { type: String },                           // Optional: Your product's link
  price: { type: Number },                         // Your own product's price

  competitors: [
    {
      name: { type: String },                      // Competitor brand/store
      url: { type: String, required: true },       // Competitor product URL
      latestPrice: { type: Number },               // Scraped competitor price
      lastChecked: { type: Date, default: Date.now }
    }
  ],

  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
