import * as PIXI from "pixi.js";

import Card from "./Card";
import { draggable } from "../utils";
import {TimedAnimation} from "./animation.js";

export default class Hand extends PIXI.Container {
    #cards = [];
    #cardContainer = new PIXI.Container();

    readonly id;

    constructor(id: string)
    {
        super();

        this.id = id;

        this.addChild(this.#cardContainer);
    }

    setCards(cards)
    {
        this.#cardContainer.removeChildren();
        this.#cards = cards;

        this.#cards.forEach((card, i) => {
            const cardElem = new Card(0, 0, true);
            let timeout:NodeJS.Timeout;
            const x = i * cardElem.width;
            cardElem.x = x;
            cardElem.on("pointerdown", () => {
                if(timeout)
                {
                    clearTimeout(timeout);
                }
            });
            cardElem.on("pointerup", () => {
                timeout = setTimeout(() => {
                    const {x: startX, y: startY} = cardElem;
                    const diffY = 0 - cardElem.y;
                    const diffX = x - cardElem.x;
                    TimedAnimation.run((progress: number) => {
                        cardElem.x = (diffX * progress) + startX;
                        cardElem.y = (diffY * progress) + startY;
                    }, 50);
                }, 120);
            });

            draggable<Card>(cardElem);
            this.#cardContainer.addChild(cardElem);
        });
    }
};