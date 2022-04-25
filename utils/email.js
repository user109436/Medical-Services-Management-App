const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const dotenv = require('dotenv');
dotenv.config({
    path: './config.env', //  use "./ " for server.js "../"" for testing email.js directly
});

if (dotenv.error) {
    throw dotenv.error
}


module.exports = class Email {
    constructor(user, url) {
        const OAuth2_client = new OAuth2(process.env.GMAIL_CLIENT_ID, process.env.GMAIL_CLIENT_SECRET)
        OAuth2_client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN })
        this.to = user.email;
        this.name = user.name; //like Hi Jane Doe! this is your...
        this.url = url;
        this.from = `E Consultation App <${process.env.EMAIL_FROM}>`
        this.accessToken = OAuth2_client.getAccessToken()//generate new access token
    }
    newTransport() {
        return nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                type:'OAuth2',
                user: process.env.EMAIL_USERNAME,
                clientId:process.env.GMAIL_CLIENT_ID,
                clientSecret:process.env.GMAIL_CLIENT_SECRET,
                refreshToken:process.env.GMAIL_REFRESH_TOKEN,
                accessToken:this.accessToken
            }
        });
    }
    htmlPlain(message) {
        if (this.url.indexOf('http') == -1) {
            return `
            <div>
            <p>Hi! ${this.name}</p> <br>
            <p>${message} <br><br> new password:${this.url}</p>
            <p><br><br>Note:You can always change your password any time</p>
            </div>
            `;
        }
        return `
        <div>
        <p>Hi! ${this.name}</p> <br>
        <a href=${this.url}>${message}</a>
        </div>
        `;
    }
    async send(message, subject) {
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            text: htmlToText.fromString(this.htmlPlain(message))
        }
        await this.newTransport().sendMail(mailOptions, (error, result) => {
            if (error) return console.error(error);
            return console.log(result);
        });
    }
    async sendEmailVerification() {
        await this.send('Click me to verify your Account', 'Email Verification - E Consultation App');

    }
    async sendPasswordReset() {
        await this.send('Here is your new system generated password', 'Password Reset - E Consultation App');

    }
}
