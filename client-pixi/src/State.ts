import * as PIXI from "pixi.js";

import ConnectionHandler from "./ConnectionHandler";

export default class State {
    static gameID: string;

    static centerElems:(PIXI.Container)[] = [];

    static connection = new ConnectionHandler();
    static events = new PIXI.utils.EventEmitter();
};