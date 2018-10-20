'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const request = requiere('request');

const app = express();

app.set('port', 5000);
app.use(bodyParser.json());

app.get('/', function (request, response) {
    response.send('Hola Mundo!')
})
