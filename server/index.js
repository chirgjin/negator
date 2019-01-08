const express = require("express");
const request = require("request");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/call', (req,res,next) => {

});

module.exports = app;