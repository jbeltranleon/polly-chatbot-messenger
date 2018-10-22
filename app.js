'use strict'

/* Web Server */
const express = require('express');
/* Para entender lo que nos envia messenger */
const bodyParser = require('body-parser');
const request = require('request');

const access_token = 'EAAjdJRRDh1MBAG3OOaqCU5RJkS6Uw79tYed6JCMdUtRAi3nUHCuv2XNZAudGu9hIkNlcVZABQ1dz3yoOIFhjR4KknG2vRGlGM9jz9RFGR4uy64PDoOVrlF4SdlPGntBFzPny84tZCBh39fDZCEBkjsyB7lME4Db9g9ZBG7PTDkZCL1UepOy0vP';

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
            handleEvent(event.sender.id, event);
        })
    }
    res.sendStatus(200);
})

/* Verificación del evento mensaje */
function handleEvent(senderId, event) {
    if (event.message) {
        handleMessage(senderId, event.message);
    } else if (event.postback) {
        handlePostback(senderId, event.postback.payload);
    }
}

/* Validar que el mensaje sea texto */
function handleMessage(senderId, event) {
    if(event.text){
        defaultMessage(senderId);
    }else if (event.attachments) {
        handleAttachments(senderId, event);
    }
}

/* Redireccionamiento de mensaje default */
function defaultMessage(senderId) {
    const messageData = {
        "recipient":{
            "id": senderId
        },
        "message":{
            "text": "Hola Soy el Chat bot de Polly :) !",
            "quick_replies": [
                {
                    "content_type": "text",
                    "title": "¿Buscas a Fredy?",
                    "payload": "CARER_PAYLOAD"
                },
                {
                    "content_type": "text",
                    "title": "¿Quieres conversar?",
                    "payload": "TALK_PAYLOAD"
                }
            ]
        }
    }
    callSendApi(messageData);
}

function handlePostback(senderId, payload) {
    switch (payload) {
        case "GET_STARTED_POLLY":
            console.log(payload)
            break;
    
        default:
            break;
    }
}

function handleAttachments(senderId, event) {
    let attachment_type = event.attachments[0].type;
    switch (attachment_type) {
        case "image":
            console.log(attachment_type);
            break;
        case "video":
            console.log(attachment_type);
            break;
        case "audio":
            console.log(attachment_type);
            break;
        case "file":
            console.log(attachment_type);
            break;
    
        default:
            break;
    }
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