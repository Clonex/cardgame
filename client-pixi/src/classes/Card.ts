import * as PIXI from "pixi.js";

export default class Card extends PIXI.Container {
    static HEIGHT = 200;
    static WIDHT = 120;
    static OUTLINE = 3;
    
    constructor(type, color, draggable)
    {
        super();

        const bg = new PIXI.Graphics();
        bg.beginFill(0x000000, 0.1).drawRoundedRect(0, 0, Card.WIDHT + Card.OUTLINE, Card.HEIGHT + Card.OUTLINE, 5).endFill();
        bg.beginFill(0xFFFFFF).drawRoundedRect(1, 1, Card.WIDHT, Card.HEIGHT, 5).endFill();

        this.addChild(bg);
    }
};