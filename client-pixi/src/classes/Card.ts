import * as PIXI from "pixi.js";


export type Types = "none" | "ZERO" | "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE" | "SIX" | "SEVEN" | "EIGHT" | "NINE" | "reverse" | "skip" | "wild" | "PLUS1" | "PLUS4";
export type Colors = "red" | "blue" | "green" | "yellow" | "none";

const COLORS = {
    "none": 0x4d4d4d,
    "red": 0xf56462,
    "blue": 0x00c3e5,
    "green": 0x2fe29b,
    "yellow": 0xf7e359,
};

export default class Card extends PIXI.Container {
    static HEIGHT = 200;
    static WIDHT = 120;
    static OUTLINE = 3;

    static CORNER_W = 30;
    static CORNER_H = 50;
    
    constructor(type: Types, color: Colors)
    {
        super();

        const bg = new PIXI.Graphics();
        bg.beginFill(0x000000, 0.1).drawRoundedRect(0, 0, Card.WIDHT + Card.OUTLINE, Card.HEIGHT + Card.OUTLINE, 5).endFill();
        bg.beginFill(0xFFFFFF).drawRoundedRect(1, 1, Card.WIDHT, Card.HEIGHT, 5).endFill();

        //Draw corners
        const COLOR = COLORS[color];
        bg.beginFill(COLOR);

        
        const text = new PIXI.Text(type, {
            fill: COLOR,
            fontSize: 24,
        });
        
        if(type === "none" && color === "none")
        {
            bg.drawRoundedRect(5, 5, Card.WIDHT - 10, Card.HEIGHT - 10, 3);
            text.style.fill = [COLORS.red, COLORS.blue];
            text.style.fillGradientStops = [0.3, 0.7],
            text.style.fontSize = 50;
            text.text = "U";
        }else{
            bg
            .drawRoundedRect(1, 1, Card.CORNER_W, Card.CORNER_H, 5)
            .drawRoundedRect(Card.WIDHT - (Card.CORNER_W - 1), 1, Card.CORNER_W, Card.CORNER_H, 5)
            .drawRoundedRect(1, Card.HEIGHT - (Card.CORNER_H - 1), Card.CORNER_W, Card.CORNER_H, 5)
            .drawRoundedRect(Card.WIDHT - (Card.CORNER_W - 1), Card.HEIGHT - (Card.CORNER_H - 1), Card.CORNER_W, Card.CORNER_H, 5);
            
        }

        text.anchor.set(0.5);
        text.y = Card.HEIGHT / 2;
        text.x = Card.WIDHT / 2;

        this.addChild(bg, text);
    }
};