import { Container, utils } from 'pixi.js';

import ConnectionHandler from './ConnectionHandler';
import { GamePage } from './pages';
import ColorPicker from './classes/ColorPicker';
import { Game } from './Game';

export default class State {
	static game = new Game();
	static gameID: string;

	static centerElems: Container[] = [];

	static connection = new ConnectionHandler();
	static events = new utils.EventEmitter();

	static gameView: GamePage;
	static colorPicker = new ColorPicker();
}
