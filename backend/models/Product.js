const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: String,
  url: String,
  price: Number,
  competitors: [
    {
      name: String,
      url: String,
    }
  ],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
