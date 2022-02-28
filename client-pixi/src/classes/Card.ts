import * as PIXI from "pixi.js";


export type Types = "none" | "ZERO" | "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE" | "SIX" | "SEVEN" | "EIGHT" | "NINE" | "reverse" | "skip" | "wild" | "PLUS1" | "PLUS4";
export type Colors = "red" | "blue" | "green" | "yellow" | "none";

export const PICKER_TYPES = ["PLUS4", "wild"];

export const COLORS = {
    "none": 0x333333,
    "red": 0xf56462,
    "blue": 0x00c3e5,
    "green": 0x2fe29b,
    "yellow": 0xf7e359,
};

export interface SERVER_CARD {
    id: string,
    color?: Colors,
    type?: Types,
};

export const TYPE_NAME = {
    "none": "",
    "ZERO": "0",
    "ONE": "1",
    "TWO": "2",
    "THREE": "3",
    "FOUR": "4",
    "FIVE": "5",
    "SIX": "6",
    "SEVEN": "7",
    "EIGHT": "8",
    "NINE": "9",
    "reverse": "↪",
    "skip": "SKIP",
    "wild": "WILD",
    "PLUS1": "+1",
    "PLUS4": "+4",
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

        
        const text = new PIXI.Text(TYPE_NAME[type], {
            fill: COLOR,
            fontSize: 50,
        });
        
        if(type === "none" && color === "none")
        {
            bg.drawRoundedRect(5, 5, Card.WIDHT - 10, Card.HEIGHT - 10, 3);
            text.style.fill = [COLORS.red, COLORS.blue];
            text.style.fillGradientStops = [0.3, 0.7],
            // text.style.fontSize = 50;
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