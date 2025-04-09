const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const scrapeRoutes = require('./routes/scrapeRoute');




dotenv.config();
connectDB();

const app = express();
app.use(express.json()); // To parse JSON

app.use('/api/auth', authRoutes);
app.use('/api', scrapeRoutes);




app.get('/', (req, res) => {
  res.send('API running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
