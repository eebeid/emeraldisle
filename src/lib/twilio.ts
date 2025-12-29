import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

export async function sendSMS(to: string, body: string) {
    if (!accountSid || !authToken || !fromNumber) {
        console.warn('Twilio credentials missing. SMS not sent:', body);
        return;
    }

    try {
        await client.messages.create({
            body: body,
            from: fromNumber, // e.g., '+1234567890'
            to: to,
        });
        console.log(`SMS sent to ${to}: ${body}`);
    } catch (error) {
        console.error('Failed to send SMS:', error);
    }
}
