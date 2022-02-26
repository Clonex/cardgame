import * as PIXI from "pixi.js";

import ConnectionHandler from "./ConnectionHandler";
import GamePage from "./GamePage";

export default class State {
    static gameID: string;

    static centerElems:(PIXI.Container)[] = [];

    static connection = new ConnectionHandler();
    static events = new PIXI.utils.EventEmitter();

    static gameView:GamePage;
};