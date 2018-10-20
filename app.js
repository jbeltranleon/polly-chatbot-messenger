'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();

app.set('port', 5000);
app.use(bodyParser.json());

app.get('/', function (request, response) {
    response.send('Hola Mundo!')
})

app.get('/webhook', function (request, response){
    if (request.query['hub.verify_token'] === 'polly_token'){
        response.send(request.query['hub.challenge']);
    } else {
        response.send('No tienes Permisos suficientes, lo siento');
    }
})

app.listen(app.get('port'), function(){
    console.log('Servidor funcionando bien aspero en el puerto', app.get('port'));
})