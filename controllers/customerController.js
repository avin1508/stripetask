const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
const { Customer } = require('../models');
const generatePassword = require('../utils/passwordGenerator');
const sendEmail = require('../services/emailService');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { generateWelcomeEmail } = require('../utils/emailTemplates');

dotenv.config()

const createCustomer = async (req, res) => {
    const { customerName, customerEmail, mobileNumber, address } = req.body;

    try {
        const existingCustomer = await stripe.customers.list({ email: customerEmail });

        if (existingCustomer.data.length > 0) {
            return res.status(400).json({ message: 'Customer with this email already exists in Stripe' });
        }

        const password = generatePassword();
        const hashedPassword = await bcrypt.hash(password, 10);

        const stripeCustomer = await stripe.customers.create({
            email: customerEmail,
            name: customerName,
            metadata: {
                mobileNumber,
                address,
            },
        });

        const newCustomer = await Customer.create({
            stripeCustomerId: stripeCustomer.id,
            customerName,
            customerEmail,
            mobileNumber,
            address,
            password: hashedPassword,
            status: 'active',
            isDeleted: false,
        });

        const emailContent = generateWelcomeEmail(customerName, password);
        await sendEmail(customerEmail, emailContent.subject, emailContent.text, emailContent.html);
        res.status(201).json({ message: 'Customer created successfully', customer: newCustomer });
    } catch (error) {
        console.error('Error creating customer:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const loginCustomer = async (req, res) => {
    const { userEmail, password } = req.body;

    try {
        const customer = await Customer.findOne({ where: { customerEmail: userEmail } });
        if (!customer || !await bcrypt.compare(password, customer.password)) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const tokenData = { customerId: customer.id };
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, { expiresIn: '1d', httpOnly: true });
        delete customer.dataValues.password;
        res.status(200).json({
            message: `Welcome back ${customer.customerName}`,
            token,
            user: customer,
            success: true
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createCustomer,loginCustomer,
};








