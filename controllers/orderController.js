const { Order} = require('../models');
const { sendOrderEmail } = require('../services/orderEmailService');
const { sendWhatsappMessage } = require('../services/whatsappService');
const orderUtils = require('../utils/orderUtils');

const createOrder = async (req, res) => {
    const {
        productId,
        customerId,
        paymentType,
        orderAddress,
        contactNumber,
        quantity,
        subtotal,
        invoiceURL,
        cgst,
        sgst,
        igst,
        total,
        email
    } = req.body;

    try {
        const orderReferenceId = await orderUtils.generateOrderReferenceId();

        const newOrder = await Order.create({
            orderReferenceId,
            productId,
            customerId,
            paymentType,
            orderAddress,
            contactNumber,
            quantity,
            subtotal,
            invoiceURL,
            cgst,
            sgst,
            igst,
            total,
            status: 'placed',
            isDeleted: false
        });
        const emailMessage = `Your order with reference ID ${orderReferenceId} has been successfully placed.`;
        await sendOrderEmail(email, 'Order Confirmation', emailMessage);
        const whatsappMessage = `Your order with reference ID ${orderReferenceId} has been successfully placed. Total amount: ${total}`;
        await sendWhatsappMessage(contactNumber, whatsappMessage);

        res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createOrder,
};


