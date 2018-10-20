'use strict'

/* Web Server */
const express = require('express');
/* Para entender lo que nos envia messenger */
const bodyParser = require('body-parser');
const request = require('request');

const access_token = 'EAAQMCDejpzkBALQ8tALGWvTGG1FSHrdwpNPXOTY5D5vsIU8paIr95ZCL6mRmEPjxYtQ7dhZC6CuSOQLZAFRd6ZBtBDKjpHdqpCOFgVtNkwfP5d3p9odzzw80IFEGkI8rRJyGVxfdKXEktcCyAEcNONDdGECZBnANKlZBrU6Vp7OFKHBJHJvnZAT';

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

/* Validar que exista un objeto mensaje y retornar un mensaje */
app.post('/webhook', function (req, res) {
    const webhook_event = req.body.entry[0];
    if(webhook_event.messaging){
        webhook_event.messaging.forEach(event => {
            console.log(event);
            handleMessage(event);
        })
    }
    res.sendStatus(200);
})

/* Manejo del mensaje recibido y su respuesta*/
function handleMessage(event) {
    const senderId = event.sender.id;
    const messageText = event.message.text;
    const messageData = {
        recipient: {
            id: senderId
        },
        message: {
            text: messageText
        }
    }
    callSendApi(messageData);
}

/* respuesta */
function callSendApi(response) {
    request({
        "uri": "https://graph.facebook.com/me/messages/",
        "qs": {
            "access_token": access_token
        },
        "method": "POST",
        "json": response
    },
    function (err) {
        if (err) {
            console.log('Ha ocurrido un error');
        }else{
            console.log('Mensaje enviado')
        }
    }
)
}

/* Log de Funcionaminto */
app.listen(app.get('port'), function(){
    console.log('Servidor funcionando bien aspero en el puerto', app.get('port'));
})