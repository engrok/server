const wssPort = '8080';
const thirdPartyPort = 8888;
const WebSocket = require('ws');
const app = require('express')();
const wss = new WebSocket.Server({ port: wssPort });
let webSocket = null;
let response = null;

wss.on('connection', socket => {
    webSocket = socket;
    webSocket.on('message', function incoming(data) {
        if (response) {
            console.log(data);
            response.send(data.toString());
        }
        response = null;
    });
});

app.listen(thirdPartyPort);

app.get('/', function (req, res) {
    if (!webSocket) {
        res.send('Client not connected!');
        return;
    }
    webSocket.send(JSON.stringify(req.headers));
    response = res;
});
