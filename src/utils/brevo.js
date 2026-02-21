export const sendVerificationEmail = async (email, otp) => {
    const url = 'https://api.brevo.com/v3/smtp/email';
    const apiKey = process.env.EXPO_PUBLIC_BREVO_API_KEY;

    const payload = {
        sender: { name: 'Velora App', email: 'abhipinjari1104@gmail.com' },
        to: [{ email: email }],
        subject: 'Your Velora Verification Code',
        htmlContent: `
        <html>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; max-width: 500px; margin: 0 auto; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
                    <h1 style="color: #000000; font-size: 24px; margin-bottom: 20px; text-align: center;">Welcome to Velora!</h1>
                    <p style="color: #333333; font-size: 16px; line-height: 1.5; text-align: center;">
                        Thank you for registering. To complete your signup, please use the verification code below:
                    </p>
                    <div style="background-color: #f8f8fa; padding: 15px; border-radius: 8px; margin: 30px 0; text-align: center;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #000000;">${otp}</span>
                    </div>
                    <p style="color: #8E8E93; font-size: 14px; text-align: center;">
                        This code is valid for 10 minutes. Please do not share this code with anyone.
                    </p>
                </div>
            </body>
        </html>
        `
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'api-key': apiKey
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Brevo API Error:', errorData);
            return false;
        }

        console.log('OTP Email Sent Successfully via Brevo!');
        return true;
    } catch (error) {
        console.error('Network Error while sending email:', error);
        return false;
    }
};
