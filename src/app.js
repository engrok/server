const wssPort = '8080';
const thirdPartyPort = 8888;
const WebSocket = require('ws');
const app = require('express')();
const { v4: uuidv4 } = require('uuid');
const wss = new WebSocket.Server({ port: wssPort });
let webSocket = null;
let response = {};

wss.on('connection', socket => {
    webSocket = socket;
    webSocket.on('message', function incoming(data) {
        let passed = JSON.parse(data);
        let currResponse = response[passed.id];
        if (currResponse) {
            currResponse.set('content-type', passed.headers['content-type']);
            currResponse.send(passed.data)
            delete response[passed.id];
        }
    });
});

app.listen(thirdPartyPort);

app.get('*', function (req, res) {
    if (!webSocket) {
        res.send('Client not connected!');
        return;
    }
    let id = uuidv4();
    let data = {
        url: req.originalUrl,
        headers: req.headers,
        id: id
    };
    response[id] = res;
    webSocket.send(JSON.stringify(data));
});