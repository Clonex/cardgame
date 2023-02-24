import WebSocket from "ws";
import GameManager from "./GameManager";

const wss = new WebSocket.Server({ 
	port: 8182
});
const manager = new GameManager(wss);

// // Add debug game
const testGame = manager.startGame(0);
testGame.id = "test";

wss.on("connection", (ws) => {
	ws.on("message", d => manager.parseData(d, ws));
	ws.on("close", d => manager.killConnection(ws));
});

console.log("Started server..");