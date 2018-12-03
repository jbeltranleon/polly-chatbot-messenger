'use strict'

/* Web Server */
const express = require('express');
/* Para entender lo que nos envia messenger */
const bodyParser = require('body-parser');
const request = require('request');

const access_token = 'EAAJ4tPYZBaeMBAA9FiogHsdcgHMr9MMD6GOj2iA0zHVpFHbY6mDIMq6DLCIxv7agvoLf9GtRbddK5XySdOZCLKZAUVVyhfRZC3znRv1r32GqZCoKq4NIdO9k6YFpZCxAN2v0mAuhj5nM3qMxpkjmjVeplq63yXWIdqrYDMUE8fls8WtvV4scxU';

const app = express();

app.set('port', (process.env.PORT || 5000));
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

/* ---- NLP ---- */

function firstEntity(nlp, name) {
    return nlp && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
}

/* Validar que el mensaje sea texto */
function handleMessage(senderId, event) {
    const email = firstEntity(event.nlp, 'email');
    const phone_number = firstEntity(event.nlp, 'phone_number');
    const date_time = firstEntity(event.nlp, 'datetime');
    const amount_of_money = firstEntity(event.nlp, 'amount_of_money');
    const distance = firstEntity(event.nlp, 'distance');
    const quantity = firstEntity(event.nlp, 'quantity');
    const temperature = firstEntity(event.nlp, 'temperature');
    const volume = firstEntity(event.nlp, 'volume');
    const location = firstEntity(event.nlp, 'location');
    const duration = firstEntity(event.nlp, 'duration');
    const url = firstEntity(event.nlp, 'url');
    const sentiment = firstEntity(event.nlp, 'sentiment');
    const greeting = firstEntity(event.nlp, 'greeting');
    const ask_sentiment = firstEntity(event.nlp, 'ask_sentiment');
    const ask_bot = firstEntity(event.nlp, 'ask_bot');
    const buy_bot = firstEntity(event.nlp, 'buy_bot');
    const ask_products = firstEntity(event.nlp, 'ask_products');
    const messageText = event.text;

    if (email && email.confidence > 0.8) {
        console.log(email);
        console.log("Correo electrónico");
        emailMessage(senderId, messageText);
    }else if (phone_number && phone_number.confidence > 0.8) {
        console.log(phone_number);
        console.log("Número de Telefono");
        phoneMessage(senderId);
    }else if (date_time && date_time.confidence > 0.85) {
        console.log(date_time);
        console.log("Fecha y Hora");
        datetimeMessage(senderId);
    }else if (amount_of_money && amount_of_money.confidence > 0.8) {
        console.log(amount_of_money);
        console.log("Dinero");
        moneyMessage(senderId);
    }else if (distance && distance.confidence > 0.8) {
        console.log(distance);
        console.log("Distancia");
        distanceMessage(senderId);
    }else if (quantity && quantity.confidence > 0.8) {
        console.log(quantity);
        console.log("Cantidad");
        quantityMessage(senderId);
    }else if (temperature && temperature.confidence > 0.8) {
        console.log(temperature);
        console.log("Temperatura");
        temperatureMessage(senderId);
    }else if (volume && volume.confidence > 0.8) {
        console.log(volume);
        console.log("Volumen");
        volumeMessage(senderId);
    }else if (location && location.confidence > 0.8) {
        console.log(location);
        console.log("Ubicación");
        locationMessage(senderId);
    }else if (duration && duration.confidence > 0.8) {
        console.log(duration);
        console.log("Duración");
        durationMessage(senderId);
    }else if (url && url.confidence > 0.8) {
        console.log(url);
        console.log("Sitio Web");
        urlMessage(senderId);
    }else if (sentiment && sentiment.confidence > 0.8) {
        console.log(sentiment);
        console.log("Sentimiento");
        sentimentMessage(senderId);
    }
    else if (greeting && greeting.confidence > 0.8) {
        console.log(greeting);
        console.log("greeting");
        //defaultMessage(senderId);
        greetingMessage(senderId);
    }
    else if (ask_sentiment && ask_sentiment.confidence > 0.8) {
        console.log(ask_sentiment);
        console.log("ask_sentiment");
        feelingMessage(senderId);
    }
    else if (ask_bot && ask_bot.confidence > 0.8) {
        console.log(ask_bot);
        console.log("ask_bot");
        botsMessage(senderId);
    }
    else if (buy_bot && buy_bot.confidence > 0.8) {
        console.log(buy_bot);
        console.log("buy_bot");
        showBots(senderId);
    }
    else if (ask_products && ask_products.confidence > 0.8) {
        console.log(ask_products);
        console.log("ask_products");
        giveContext(senderId);
    }
    //manychat
    else if (event.text.toLowerCase() == 'correo') {
        console.log("Correo");
        //break;
    }else if (event.text.toLowerCase() == 'si, claro') {
        console.log("si");
        //break;
    }else if (event.text.toLowerCase() == 'no, cúentame') {
        console.log("no");
        //break;
    }else if (event.text.toLowerCase() == 'genial') {
        console.log("si");
        //break;
    }else if (event.text.toLowerCase() == 'no, gracias') {
        console.log("no");
        //break;
    }else {
        defaultMessage(senderId);
    }
    
    if (event.text.toLowerCase() == 'llamar a fredy') {
        contactSupport(senderId);
    }else if (event.text.toLowerCase() == 'busco información') {
        showTopics(senderId);
    }else if (event.text.toLowerCase() == '¿Cuales me ofrecen?') {
        showBots(senderId);
    }else if (event.text.toLowerCase() == 'contacto') {
        contactSupport(senderId);
    }else if (event.text.toLowerCase() == 'si, claro') {
        salesMessage(senderId);
        showBots(senderId);
    }else if (event.text.toLowerCase() == 'no, cuentame') {
        botsMessage(senderId);
    }else if (event.text.toLowerCase() == 'genial') {
        console.log("correo si");
    }else if (event.text.toLowerCase() == 'no, gracias') {
        console.log("correo no");
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
            "text": "¿Puedes decirlo de otra forma? No te entiendo",
            "quick_replies": [
                {
                    "content_type": "text",
                    "title": "Llamar a Fredy",
                    "payload": "CALL_PAYLOAD"
                },
                {
                    "content_type": "text",
                    "title": "Busco Información",
                    "payload": "TALK_PAYLOAD"
                }
            ]
        }
    }
    senderActions(senderId)
    callSendApi(messageData);
}

function giveContext(senderId) {
    const messageData = {
        "recipient":{
            "id": senderId
        },
        "message":{
            "text": "¿Sabes que es un ChatBot? 🤔",
            "quick_replies": [
                {
                    "content_type": "text",
                    "title": "Si, claro",
                    "payload": "CALL_PAYLOAD"
                },
                {
                    "content_type": "text",
                    "title": "No, cúentame",
                    "payload": "TALK_PAYLOAD"
                }
            ]
        }
    }
    senderActions(senderId)
    callSendApi(messageData);
}

function startMessage(senderId) {
    const messageData = {
        "recipient":{
            "id": senderId
        },
        "message":{
            "text": "Hola, mi nombre es Polly y Soy Chatbot! 🤖",
            "quick_replies": [
                {
                    "content_type": "text",
                    "title": "Llamar a Fredy",
                    "payload": "CALL_PAYLOAD"
                },
                {
                    "content_type": "text",
                    "title": "Busco Información",
                    "payload": "TALK_PAYLOAD"
                }
            ]
        }
    }
    senderActions(senderId)
    callSendApi(messageData);
}

function greetingMessage(senderId) {
    const messageData = {
        "recipient":{
            "id": senderId
        },
        "message":{
            "text": "Hola de nuevo 🙄...",
            "quick_replies": [
                {
                    "content_type": "text",
                    "title": "Llamar a Fredy",
                    "payload": "CALL_PAYLOAD"
                },
                {
                    "content_type": "text",
                    "title": "Busco Información",
                    "payload": "TALK_PAYLOAD"
                }
            ]
        }
    }
    senderActions(senderId)
    callSendApi(messageData);
}

function salesMessage(senderId) {
    const messageData = {
        "recipient":{
            "id": senderId
        },
        "message":{
            "text": "sabias que los bots son buenos para tu negocio? Te ofrecemos los siguientes:",
        }
    }
    senderActions(senderId)
    callSendApi(messageData);
}

function datetimeMessage(senderId) {
    const messageData = {
        "recipient":{
            "id": senderId
        },
        "message":{
            "text": "Agendaré esa fecha en mi calendario imaginario.",
        }
    }
    senderActions(senderId)
    callSendApi(messageData);
}

function moneyMessage(senderId) {
    const messageData = {
        "recipient":{
            "id": senderId
        },
        "message":{
            "text": "Billete, lucas, ligas!",
        }
    }
    senderActions(senderId)
    callSendApi(messageData);
}

function phoneMessage(senderId) {
    const messageData = {
        "recipient":{
            "id": senderId
        },
        "message":{
            "text": "No nos llames, nosotros te llamamos!",
        }
    }
    senderActions(senderId)
    callSendApi(messageData);
}

function emailMessage(senderId, messageText) {
    
    const messageData = {
        "recipient":{
            "id": senderId
        },
        "message":{
            "text": messageText + " No habia un correo un poco más decente?",
        }
    }
    senderActions(senderId)
    callSendApi(messageData);
}

function distanceMessage(senderId) {
    const messageData = {
        "recipient":{
            "id": senderId
        },
        "message":{
            "text": "Eso queda re lejos!",
        }
    }
    senderActions(senderId)
    callSendApi(messageData);
}

function quantityMessage(senderId) {
    const messageData = {
        "recipient":{
            "id": senderId
        },
        "message":{
            "text": "No será mucho pan?",
        }
    }
    senderActions(senderId)
    callSendApi(messageData);
}

function temperatureMessage(senderId) {
    const messageData = {
        "recipient":{
            "id": senderId
        },
        "message":{
            "text": "Agradable temperatura!",
        }
    }
    senderActions(senderId)
    callSendApi(messageData);
}

function volumeMessage(senderId) {
    const messageData = {
        "recipient":{
            "id": senderId
        },
        "message":{
            "text": "Hable mas fuerte que tengo una toalla!",
        }
    }
    senderActions(senderId)
    callSendApi(messageData);
}

function locationMessage(senderId) {
    const messageData = {
        "recipient":{
            "id": senderId
        },
        "message":{
            "text": "Se puede llegar en taxi?",
        }
    }
    senderActions(senderId)
    callSendApi(messageData);
}

function durationMessage(senderId) {
    const messageData = {
        "recipient":{
            "id": senderId
        },
        "message":{
            "text": "Parece demaciado!",
        }
    }
    senderActions(senderId)
    callSendApi(messageData);
}

function urlMessage(senderId) {
    const messageData = {
        "recipient":{
            "id": senderId
        },
        "message":{
            "text": "Quizá mas tarde la vea, quizá no!",
        }
    }
    senderActions(senderId)
    callSendApi(messageData);
}

function sentimentMessage(senderId) {
    const messageData = {
        "recipient":{
            "id": senderId
        },
        "message":{
            "text": "Ajá, ok :) \n ¿Necesitas algo?",
        }
    }
    senderActions(senderId)
    callSendApi(messageData);
}

function feelingMessage(senderId) {
    const messageData = {
        "recipient":{
            "id": senderId
        },
        "message":{
            "text": "Puej bien, tú cómo estás?",
        }
    }
    senderActions(senderId)
    callSendApi(messageData);
}

function sportsMessage(senderId) {
    const messageData = {
        "recipient":{
            "id": senderId
        },
        "message":{
            "text": "A los gatos nos gustan mucho los deportes :) !",
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
            startMessage(senderId)
            break;
        case "CHATBOTS_PAYLOAD":
            showBots(senderId);
            break;
        case "PERSONALBOT_PAYLOAD":
            botMood(senderId);
            break;
        case "WTF_BOTS_PAYLOAD":
            console.log("Watafaaaaaaaaaaa")
            botsMessage(senderId);
            break;
        case "SPORTS_PAYLOAD":
            sportsMessage(senderId);
            break;
        case "CONTACT_PAYLOAD":
            contactSupport(senderId);

        //Revisión de captura de email
        case "BUSINESSBOT_PAYLOAD":
            getEmail(senderId);
            break;
            
        default:
            break;
    }
}

function handleAttachments(senderId, event) {
    let attachment_type = event.attachments[0].type;
    switch (attachment_type) {
        case "image":
            messageImage(senderId);
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
        case "location":
            console.log(JSON.stringify(event))
            receipt(senderId);
    
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

function botsMessage(senderId) {
    const messageData = {
        "recipient":{
            "id": senderId
        },
        "message":{
            "text": "Los bots son quienes van a remplazarte en el trabajo !",
        }
    }
    senderActions(senderId)
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
                            "title": "Chat Bot",
                            "subtitle": "¿Necesito uno?",
                            "image_url": "https://images.unsplash.com/photo-1531732960586-947a95bbc438?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=149776eddc5673a2499fab0f722dbc48&auto=format&fit=crop&w=511&q=80",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "¿Que es un Chatbot?",
                                    "payload": "WTF_BOTS_PAYLOAD"
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

function contactSupport(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload":{
                    "template_type": "button",
                    "text": "Si Fredy no te contesta podemos seguir chateando... 🐱",
                    "buttons": [
                        {
                            "type": "phone_number",
                            "title": "Llamar",
                            "payload": "+57 3223891049"
                        }
                    ]
                }
            }
        }
    }
    callSendApi(messageData)
}

function showLocations(senderId) {
    const messageData = {
        "recipient":{
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "list",
                    "top_element_style": "large",
                    "elements": [
                        {
                            "title": "Bogotá",
                            "image_url": "https://images.unsplash.com/photo-1536334906170-ffa95819c4d4?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=bb92a6ff6c11ce3380ee77313f3cebe7&auto=format&fit=crop&w=1050&q=80",
                            "subtitle": "Dirección",
                            "buttons": [
                                {
                                    "title": "Ver en el mapa",
                                    "type": "web_url",
                                    "url": "https://goo.gl/maps/kr9tge5WQWA2",
                                    "webview_height_ratio": "full"
                                }
                            ]
                        },
                        {
                            "title": "Fusagasugá",
                            "image_url": "https://images.unsplash.com/photo-1535314003016-19fbc0546a8a?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=8517ffbae682087ef9edf97cca482860&auto=format&fit=crop&w=967&q=80",
                            "subtitle": "Dirección",
                            "buttons": [
                                {
                                    "title": "Ver en el mapa",
                                    "type": "web_url",
                                    "url": "https://goo.gl/maps/gDf193qhr1B2",
                                    "webview_height_ratio": "tall"
                                }
                            ]
                        },
                    ]
                }
            }
        }
    }
    callSendApi(messageData);
}

function messageImage(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "image",
                "payload": {
                    "url": "https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif"
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
    callSendApi(messageData);
}

function receipt(senderId){
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload":{
                    "template_type": "receipt",
                    "recipient_name": "Jhon Beltrán",
                    "order_number": "1234565432",
                    "currency": "COP",
                    "payment_method": "Efectivo",
                    "order_url": "https://jbeltranleon.com/order/123",
                    "timestamp": "12344234",
                    "address": {
                        "street_1": "Universidad de Cundinamarca",
                        "street_2": "---",
                        "city": "Fusagasugá",
                        "postal_code": "272211",
                        "state": "Cundinamarca",
                        "country": "Colombia"
                    },
                    "summary": {
                        "subtotal": 3000000,
                        "shipping_cost": 0,
                        "total_tax": 40000,
                        "total_cost": 3040000
                    },
                    "adjustments": [
                        {
                            "name": "Cliente Frecuente",
                            "amount": 40000
                        }
                    ],
                    "elements": [
                        {
                            "title": "Chat Bot Personal",
                            "subtitle": "Subtitulo",
                            "quantity": 1,
                            "price": 3000000,
                            "currency": "COP",
                            "image_url": "https://images.unsplash.com/photo-1494959764136-6be9eb3c261e?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=d56d83667dc38f36ed4bd763b01fc1f0&auto=format&fit=crop&w=1050&q=80"
                        },
                        {
                            "title": "Chat Bot Personal",
                            "subtitle": "Subtitulo",
                            "quantity": 2,
                            "price": 6000000,
                            "currency": "COP",
                            "image_url": "https://images.unsplash.com/photo-1494959764136-6be9eb3c261e?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=d56d83667dc38f36ed4bd763b01fc1f0&auto=format&fit=crop&w=1050&q=80"
                        }
                    ]

                }
            }
        }
    }
    callSendApi(messageData)
}

function getLocation(senderId){
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "text": "Ahora ¿Puedes proporcionarnos tu ubicación?",
            "quick_replies": [
                {
                    "content_type": "location"
                }
            ]
        }
    }
    callSendApi(messageData);
}

function getEmail(senderId){
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "text": "¿Cual es tu correo?",
            "quick_replies": [
                {
                    "content_type": "user_email"
                }
            ]
        }
    }
    callSendApi(messageData);
}

/* Log de Funcionaminto */
app.listen(app.get('port'), function(){
    console.log('Servidor funcionando bien aspero en el puerto', app.get('port'));
})