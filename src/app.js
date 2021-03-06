import "babel-polyfill";
// import express from "express";
// import kue from 'kue';
//
// const app = express();
//
// const queue = kue.createQueue({
//     redis: process.env.REDIS
// });
//
// app.use('/queue', kue.app);
//
// app.listen(process.env.PORT || 3002, function () {
//     console.log("Started on port %d in %s mode", this.address().port, app.settings.env);
// });
//
// module.exports = app;

import kue from 'kue';
import * as mailgun from 'mailgun.js';

const queue = kue.createQueue({
    redis: process.env.REDIS
});

queue.watchStuckJobs(6000);

const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY});

queue.process('email', 20, function (job, done) {
    mg.messages.create(process.env.MAILGUN_DOMAIN, {
        from: "Excited User <postmaster@sandbox89efefeaf46d4945816a53f124d0c24d.mailgun.org>",
        to: [job.data.to],
        subject: job.data.subject,
        text: job.data.content,
        html: "<h1>" + job.data.content + "</h1>"
    });
    done();
});

