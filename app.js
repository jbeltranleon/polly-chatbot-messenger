'use strict'

/* Web Server */
const express = require('express');
/* Para entender lo que nos envia messenger */
const bodyParser = require('body-parser');
const request = require('request');

const access_token = 'EAAJ4tPYZBaeMBAA9FiogHsdcgHMr9MMD6GOj2iA0zHVpFHbY6mDIMq6DLCIxv7agvoLf9GtRbddK5XySdOZCLKZAUVVyhfRZC3znRv1r32GqZCoKq4NIdO9k6YFpZCxAN2v0mAuhj5nM3qMxpkjmjVeplq63yXWIdqrYDMUE8fls8WtvV4scxU';

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
    senderActions(senderId)
    callSendApi(messageData);
}

function handlePostback(senderId, payload) {
    console.log(payload)
    switch (payload) {
        case "GET_STARTED_POLLY":
            console.log(payload)
            break;
        /* Aún no funciona */
        case "TALK_PAYLOAD":
            showTopics(senderId);
            break;
        case "CHATBOTS_PAYLOAD":
            showBots(senderId);
            break;
        case "PERSONALBOT_PAYLOAD":
            botMood(senderId);
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

function senderActions(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "sender_action": "typing_on"
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

function showTopics(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment":{
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                        {
                            "title": "Gatos",
                            "subtitle": "¡Hablemos de los mejores!",
                            "image_url": "https://images.unsplash.com/photo-1517331156700-3c241d2b4d83?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=1202328eba9feb2db5d77a95f0938672&auto=format&fit=crop&w=748&q=80",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Hablemos de Gatos",
                                    "payload": "CATS_PAYLOAD"
                                }
                            ]
                        },
                        {
                            "title": "Deportes",
                            "subtitle": "¡A los gatos nos encantan los deportes!",
                            "image_url": "https://images.unsplash.com/photo-1529763886910-f0cdc57d31c7?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=1d402f0b1266adca76031d6fdd658a5a&auto=format&fit=crop&w=750&q=80",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Hablemos de Deportes",
                                    "payload": "SPORTS_PAYLOAD"
                                }
                            ]
                        }
                    ]
                }
            }
        }
    }
    callSendApi(messageData);
}

function showBots(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment":{
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                        {
                            "title": "ChatBot para Negocios",
                            "subtitle": "¡Descripción!",
                            "image_url": "https://images.unsplash.com/photo-1526541081349-3ee69702354c?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=23efff703c6e62768692504214aedcf0&auto=format&fit=crop&w=1050&q=80",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Para mi Negocio",
                                    "payload": "BUSINESSBOT_PAYLOAD"
                                }
                            ]
                        },
                        {
                            "title": "ChatBot Personal",
                            "subtitle": "¡Descripción",
                            "image_url": "https://images.unsplash.com/photo-1494959764136-6be9eb3c261e?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=d56d83667dc38f36ed4bd763b01fc1f0&auto=format&fit=crop&w=1050&q=80",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Para mí",
                                    "payload": "PERSONALBOT_PAYLOAD"
                                }
                            ]
                        }
                    ]
                }
            }
        }
    }
    callSendApi(messageData);
}

function botMood(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            attachment: {
                "type": "template",
                "payload": {
                    "template_type": "list",
                    "top_element_style": "large",
                    "elements": [
                        {
                            "title": "Profesional",
                            "image_url": "https://images.unsplash.com/photo-1536313307004-edfdf22be4a8?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=c583b92159f184043f0ec311c1dd746e&auto=format&fit=crop&w=846&q=80",
                            "subtitle": "Honesto, cientifico, medico, Directo...",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Elegir Profesional",
                                    "payload": "PROFESIONAL_PAYLOAD",
                                }
                            ]
                        },
                        {
                            "title": "Amistoso",
                            "image_url": "https://images.unsplash.com/photo-1540510753998-5da2dbd52dbb?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=b2b9f2228c4ecbf2538b4afbc445c511&auto=format&fit=crop&w=1050&q=80",
                            "subtitle": "Honesto, Personal, Humilide...",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Elegir Amistoso",
                                    "payload": "FRIENDLY_PAYLOAD",
                                }
                            ]
                        }
                    ]
                }
            }
        }
    }
    callSendApi(messageData)
}

/* Log de Funcionaminto */
app.listen(app.get('port'), function(){
    console.log('Servidor funcionando bien aspero en el puerto', app.get('port'));
})