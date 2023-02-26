const express = require('express')
const cookieParser = require('cookie-parser')
const config = require('./config/key');

const app = express()
const port = 3000

const route = require("./routes");

// .use middleware setting

// application/json format parsing
app.use(express.json()); // express 4.x > 내장 기능

// application/x-www-form-urlencoded format parsing
app.use(express.urlencoded({ extended: true })); // express 4.x > 내장 기능
app.use(cookieParser());

// Routing
app.use("/", route);

const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
mongoose.connect(config.monogoURI, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB connected...!'))
  .catch(err => console.log(err));


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})