import twilio  from "twilio";
import config from "../config/config.js";

class twilioService {
    constructor() {
        this.client = twilio(
            config.twilio.accountSID,
            config.twilio.authToken
        );
    };

    sendSMS(to, body) {
        return this.client.messages.create({
            to,
            body,
            from: config.twilio.phoneNumber
        });
    };
}

export default new twilioService; 