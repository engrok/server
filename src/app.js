const WebSocket = require('ws');
const app = require('express')(); 
const wss = new WebSocket.Server({ port: '8080' }); 
let webSocket = null;

wss.on('connection', socket => {
    webSocket = socket;
});

app.listen(8888);

app.get('/', function (req, res) {
    if (!webSocket) {
        res.send('Client not connected!');
        return;
    }
    webSocket.send(JSON.stringify(req.headers));
    res.send(JSON.stringify(req.headers));
});
