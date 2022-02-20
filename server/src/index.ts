import WebSocket from "ws";
import GameManager from "./GameManager";

const wss = new WebSocket.Server({ port: 8080 });
const manager = new GameManager(wss);

wss.on('connection', function connection(ws) {
    ws.on('message', d => manager.parseData(d, ws));
    ws.on('close', d => manager.killConnection(ws));
});

console.log("Started server..");