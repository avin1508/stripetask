const Order = require('../models/Order');

const generateOrderReferenceId = async () => {
    try {
        const orderCount = await Order.count();
        const incrementedCount = orderCount + 1;
        const orderReferenceId = `#ORD${String(incrementedCount).padStart(4, '0')}`;

        return orderReferenceId;
    } catch (error) {
        console.error('Error generating order reference ID:', error);
        throw error;
    }
};

module.exports = {
    generateOrderReferenceId,
};
