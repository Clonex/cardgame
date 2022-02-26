import * as PIXI from "pixi.js";

import Card from "./Card";
import State from "../State";

import {draggable, isWithin} from "../utils";
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
            const cardElem = new Card("ZERO", "blue");
            let timeout:NodeJS.Timeout;
            const x = i * cardElem.width;
            cardElem.x = x;
            cardElem.on("pointerdown", () => {
                this.#sortCard(cardElem);
                cardElem.alpha = 0.5;
                if(timeout)
                {
                    clearTimeout(timeout);
                }
            });
            cardElem.on("moved", () => {
                if(isWithin(cardElem, State.gameView.cardStack))
                {
                    cardElem.alpha = 1;
                }else{
                    cardElem.alpha = 0.5;
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
                    cardElem.alpha = 1;
                }, 350);
            });

            draggable<Card>(cardElem);
            this.#cardContainer.addChild(cardElem);
        });
    }

    #sortCard(card: Card)
    {
        this.#cardContainer.children.sort((a, b) => {
            if(a === card)
            {
                return 1;
            }else if(b === card)
            {
                return -1;
            }
            return 0;
        });
    }
};