import * as PIXI from "pixi.js";

import Card from "./Card";
import Player from "./Player";
import State from "../State";

import {draggable, isWithin} from "../utils";
import {TimedAnimation} from "./animation";

export default class Hand extends Player {
    #cards = [];

    setCards(cards)
    {
        this.cardContainer.removeChildren();
        this.#cards = cards;

        this.#cards.forEach((card, i) => {
            const cardElem = new Card(card.type, card.color);
            let timeout:NodeJS.Timeout;
            const x = i * cardElem.width;
            cardElem.cursor = "pointer";
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
                cardElem.alpha = 1;
                if(isWithin(cardElem, State.gameView.cardStack))
                {
                    State.connection.send({
                        cmd: "play",
                        cardID: card.id
                    });
                }else{
                    timeout = setTimeout(() => {
                        const {x: startX, y: startY} = cardElem;
                        const diffY = 0 - cardElem.y;
                        const diffX = x - cardElem.x;
                        TimedAnimation.run((progress: number) => {
                            cardElem.x = (diffX * progress) + startX;
                            cardElem.y = (diffY * progress) + startY;
                        }, 50);
                    }, 200);
                }
            });

            draggable<Card>(cardElem);
            this.cardContainer.addChild(cardElem);
        });
    }

    #sortCard(card: Card)
    {
        this.cardContainer.children.sort((a, b) => {
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