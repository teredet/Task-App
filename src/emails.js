import formData from 'form-data';
import Mailgun from 'mailgun.js';

import { MAILGUN_API_KEY, MAILGUN_DOMAIN } from './settings.js';


const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: 'api', key: MAILGUN_API_KEY });

function sendWelcomeEmail(email, name) {
    mg.messages.create(MAILGUN_DOMAIN, {
        from: `Excited User <mailgun@${MAILGUN_DOMAIN}>`,
        to: [email],
        subject: "Welcome to the app!",
        text: `Welcome to the app, ${name}.`,
        html: `<h1>Welcome to the app, ${name}.</h1>`
    })
        .then(msg => console.log(msg))
        .catch(err => console.log(err));
}

function sendCancelationEmail(email, name) {
    mg.messages.create(MAILGUN_DOMAIN, {
        from: `Excited User <mailgun@${MAILGUN_DOMAIN}>`,
        to: [email],
        subject: "You removed your accaunt.",
        text: `Hello, ${name}. Why did you delete your accaunt?`
    })
        .then(msg => console.log(msg))
        .catch(err => console.log(err));
}

export { sendWelcomeEmail, sendCancelationEmail }
