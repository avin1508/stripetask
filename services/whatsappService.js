const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

const sendWhatsappMessage = async (to, message) => {
    try {
        await client.messages.create({
            body: message,
            from: `whatsapp:${twilioNumber}`,
            to: `whatsapp:${to}`
        });
        console.log('WhatsApp message sent successfully');
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
        throw error;
    }
};

module.exports = {
    sendWhatsappMessage,
};
