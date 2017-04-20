import kue from 'kue';
import * as mailgun from 'mailgun.js';

const queue = kue.createQueue({
    redis: process.env.REDIS
});

const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY});

queue.process('email', 20, function (job, done) {
    mg.messages.create(process.env.MAILGUN_DOMAIN, {
        from: "Excited User <postmaster@sandbox89efefeaf46d4945816a53f124d0c24d.mailgun.org>",
        to: ["samuel.lee@jetspree.com"],
        subject: "Hello",
        text: "Testing some Mailgun awesomness!",
        html: "<h1>Testing some Mailgun awesomness!</h1>"
    });
    done();
});