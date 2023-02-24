import * as PIXI from "pixi.js";

import ConnectionHandler from "./ConnectionHandler";
import GamePage from "./GamePage";
import ColorPicker from "./classes/ColorPicker";

export default class State {
	static gameID: string;

	static centerElems: PIXI.Container[] = [];

	static connection = new ConnectionHandler();
	static events = new PIXI.utils.EventEmitter();

	static gameView: GamePage;
	static colorPicker = new ColorPicker();
}
