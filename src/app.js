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
        let currResponse = response[passed.data.id];
        if (currResponse) {
            if (!passed.result) {
                currResponse.send('Error occurred!');
                delete response[passed.data.id];
                return;
            }
            currResponse.set(passed.data.headers);
            currResponse.status(passed.data.status);
            currResponse.send(passed.data.data);
            delete response[passed.data.id];
        }
    });
});

app.listen(thirdPartyPort);

function redirectToClient(req, res) {
    if (!webSocket) {
        res.send('Client not connected!');
        return;
    }
    let id = uuidv4();
    let data = {
        url: req.originalUrl,
        headers: req.headers,
        id: id,
        method: req.method
    };
    response[id] = res;
    webSocket.send(JSON.stringify(data));
}

app.route('*')
    .get(redirectToClient)
    .post(redirectToClient)
