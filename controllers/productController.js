const { Product } = require('../models')
const dotenv = require('dotenv');
dotenv.config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  

const createProduct = async (req, res) => {
    const { productName, description, availableQuantity } = req.body;
    try {
        let existingProduct = null;
        const products = await stripe.products.list();
        existingProduct = products.data.find(product => product.name.toLowerCase() === productName.toLowerCase());
        if (existingProduct) {
            return res.status(400).json({ message: 'Product with this name already exists in Stripe' });
        }
        const stripeProduct = await stripe.products.create({
            name: productName,
            description: description,
            metadata: {
                availableQuantity,
            },
        });
        const newProduct = await Product.create({
            stripeProductId: stripeProduct.id,
            productName,
            description,
            availableQuantity,
            status: 'active',
            isDeleted: false,
        });
        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



  


//another way but not working

// const createProduct = async (req, res) => {
//     const { productName, description, availableQuantity } = req.body;
//     try {
//         let existingProduct = null;
//         let hasMore = true;
//         let startingAfter = null;
//         while (hasMore) {
//             const products = await stripe.products.list({ limit: 100, starting_after: startingAfter });
//             existingProduct = products.data.find(product => product.name.toLowerCase() === productName.toLowerCase());
//             if (existingProduct || !products.has_more) {
//                 hasMore = false;
//             } else {
//                 startingAfter = products.data[products.data.length - 1].id;
//             }
//         }
//         if (existingProduct) {
//             return res.status(400).json({ message: 'Product with this name already exists in Stripe' });
//         }
//         const stripeProduct = await stripe.products.create({
//             name: productName,
//             description: description || '',
//             metadata: {
//                 availableQuantity,
//             },
//         });
//         const newProduct = await Product.create({
//             stripeProductId: stripeProduct.id,
//             productName,
//             description,
//             availableQuantity,
//             status: 'active',
//             isDeleted: false,
//         });

//         res.status(201).json({ message: 'Product created successfully', product: newProduct });
//     } catch (error) {
//         console.error('Error creating product:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };






module.exports = {
    createProduct,
};