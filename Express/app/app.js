"use strict";

const express = require('express');

const config = require('./src/config');

const app = express();

app.listen(config.PORT, () => {
    console.log("Run Server");
});

module.exports = app;