import * as PIXI from "pixi.js";

import Hand from "./classes/Hand";

export default class GamePage extends PIXI.Container {

    constructor()
    {
        super();

        const hand = new Hand("1");
        hand.setCards([1,2,3]);

        this.addChild(hand);
    }

};