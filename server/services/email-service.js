import {apiConfig} from "../config/index"
import emailTemplate from "../templates/email-template"
import regeneratorRuntime from "regenerator-runtime"
import _ from "lodash"

// Helper Method
String.prototype.capitalize = str => str.charAt(0).toUpperCase() + str.slice(1)

export default class EmailService {
    constructor(mailService) {
        this.mailService = mailService
        this.OutboundEmailAddress = "donotreply@movethedial.com"
    }

    async send(name, to, time, resetCode /* Email Template */) {
        // Update this method to abstract the EmailTemplate to by dynamic
        // The template will be passed and the Router level /authRoutes
        return await this.mailService
            .send({
                to,
                from: this.OutboundEmailAddress,
                subject: `Password Reset Request for ${to}`,
                text: `Please follow this link to reset password: ${apiConfig.baseUrl}/reset-password?code=${resetCode}`,
                html: emailTemplate.html(_.capitalize(name), apiConfig.baseUrl, time, resetCode),
            })
            .then(sent => {
                return {
                    result: "Email Sent Successfully!",
                    data: sent,
                }
            })
            .catch(error => {
                throw new Error("Email was not sent: ", error)
            })
    }
}
