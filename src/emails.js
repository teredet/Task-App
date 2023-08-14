import formData from 'form-data';
import Mailgun from 'mailgun.js';


const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });

function sendWelcomeEmail(email, name) {
    mg.messages.create(process.env.MAILGUN_DOMAIN, {
        from: `Excited User <mailgun@${process.env.MAILGUN_DOMAIN}>`,
        to: [email],
        subject: "Welcome to the app!",
        text: `Welcome to the app, ${name}.`,
        html: `<h1>Welcome to the app, ${name}.</h1>`
    })
        .then(msg => console.log(msg))
        .catch(err => console.log(err));
}

function sendCancelationEmail(email, name) {
    mg.messages.create(process.env.MAILGUN_DOMAIN, {
        from: `Excited User <mailgun@${process.env.MAILGUN_DOMAIN}>`,
        to: [email],
        subject: "You removed your accaunt.",
        text: `Hello, ${name}. Why did you delete your accaunt?`
    })
        .then(msg => console.log(msg))
        .catch(err => console.log(err));
}

export { sendWelcomeEmail, sendCancelationEmail }
