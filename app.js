'use strict'

/* Web Server */
const express = require('express');
/* Para entender lo que nos envia messenger */
const bodyParser = require('body-parser');
const request = require('request');

const app = express();

app.set('port', 5000);
app.use(bodyParser.json());

/* Url Base */
app.get('/', function (req, response) {
    response.send('Hola Mundo!')
})

/* Verificación de token esta url la pondremos en /messenger/settings/*/
app.get('/webhook', function (req, response){
    if (req.query['hub.verify_token'] === 'polly_token'){
        response.send(req.query['hub.challenge']);
    } else {
        response.send('No tienes Permisos suficientes, lo siento');
    }
})

/* Validar que exista un objeto mensaje y retornarlo */
app.post('/webhook', function (req, res) {
    const webhook_event = req.body.entry[0];
    if(webhook_event.messaging){
        webhook_event.messaging.forEach(event => {
            console.log(event);
        })
    }
    res.sendStatus(200);
})

/* Log de Funcionaminto */
app.listen(app.get('port'), function(){
    console.log('Servidor funcionando bien aspero en el puerto', app.get('port'));
})