import WebSocket from "ws";
import http from "http";
import GameManager from "./GameManager";

const server = http.createServer();
server.listen(process.env.PORT || 8080);

const wss = new WebSocket.Server({ 
    // port: process.env.PORT || 8080
    server,
});
const manager = new GameManager(wss);

wss.on('connection', (ws) => {
    ws.on('message', d => manager.parseData(d, ws));
    ws.on('close', d => manager.killConnection(ws));
});

console.log("Started server..");