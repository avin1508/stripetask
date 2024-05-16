const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/sequelize');
const customerRoutes = require('./routes/customerRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

//database
sequelize.sync().then(() => {
  console.log('Database synchronized');
}).catch((error) => {
  console.error('Error synchronizing database:', error);
});

//routing
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/order',orderRoutes);

app.listen(PORT, () => {
  console.log(`Server is listening at PORT ${PORT}`);
});

