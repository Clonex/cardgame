import WebSocket from "ws";
// import http from "http";
import express from "express";

import GameManager from "./GameManager";

const server = express();
server.use((req, res) => res.sendFile("/", { root: __dirname }))
// const server = http.createServer(app);
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