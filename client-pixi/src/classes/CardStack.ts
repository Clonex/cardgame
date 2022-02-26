import * as PIXI from "pixi.js";

export default class CardStack extends PIXI.Container {
    static RADIUS = 150;
    constructor()
    {
        super();

        const bg = new PIXI.Graphics();
        bg.beginFill(0xFFFFFF).drawCircle(CardStack.RADIUS, CardStack.RADIUS, CardStack.RADIUS);

        this.addChild(bg);
    }
}