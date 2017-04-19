import "babel-polyfill";
import express from "express";
import kue from 'kue';
import * as mailgun from 'mailgun.js';

const app = express();
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

app.use((req, res, next) => {

    queue.on('ready', () => {
        console.log('Queue is ready!');
    });

    queue.on('error', (err) => {
        console.error(err);
        console.error(err.stack);
    });
    req.queue = queue;
    next();
});

app.use('/queue', kue.app);

app.listen(process.env.PORT || 3002, function () {
    console.log("Started on port %d in %s mode", this.address().port, app.settings.env);
});

module.exports = app;


