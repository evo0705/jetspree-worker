import "babel-polyfill";
import express from "express";
import kue from 'kue';

const app = express();

const queue = kue.createQueue({
    redis: process.env.REDIS
});

app.use('/queue', kue.app);

app.listen(process.env.PORT || 3002, function () {
    console.log("Started on port %d in %s mode", this.address().port, app.settings.env);
});

module.exports = app;


