import twilio from "twilio";

export const sendSms = async (phone, otp) => {
  try {
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    const message = await client.verify?.v2.services(process.env.TWILIO_VERIFY_SID)
      .verifications
      .create({to: '+91' + phone, channel: 'sms'});

    return message;
    
  } catch (error) {
    console.error("Twilio Send OTP Error:", error.message);
    throw new Error("Failed to send OTP");
  }
};

export const verifyOtpSms = async (phone, otp) => {
  try {
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    const response = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verificationChecks.create({
        to: `+91${phone}`,
        code: otp
      });

    return response;

  } catch (error) {
    console.error("Twilio Verify Error:", error.message);
    throw new Error("OTP verification failed");
  }
};