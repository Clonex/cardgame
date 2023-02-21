import * as PIXI from "pixi.js";

import {Card, PICKER_TYPES, SERVER_CARD, Colors} from "./Card";
import {Player} from "./Player";
import State from "../State";

import {draggable, isWithin} from "../utils";
import {TimedAnimation} from "./animation";

export class Hand extends Player {
    lastCardPlayed?: SERVER_CARD;

    setCards(cards: SERVER_CARD[])
    {
        this.cardContainer.removeChildren();
        this.cards = cards;

        this.cardElems = [];
        this.cards.forEach((card, i) => {
            const IS_PICK = PICKER_TYPES.includes(card.type ?? "none");
            const cardElem = new Card(card.type ?? "none", IS_PICK ? "none" : (card?.color ?? "none"), card.id);
            let timeout:NodeJS.Timeout;
            const x = i * cardElem.width;
            cardElem.cursor = "pointer";
            cardElem.setHomeX(x);
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
            cardElem.on("pointerup", async () => {
                cardElem.alpha = 1;
                if(isWithin(cardElem, State.gameView.cardStack))
                {
                    this.lastCardPlayed = card;
                    let color: Colors|undefined;
                    if(IS_PICK)
                    {
                        color = await State.colorPicker.open();
                    }
                    State.connection.send({
                        cmd: "playCard",
                        cardID: card.id,
                        color,
                    });
                }else{
                    timeout = setTimeout(() => cardElem.moveToHand(), 200);
                }
            });

            draggable<Card>(cardElem);
            this.cardContainer.addChild(cardElem);
            this.cardElems.push(cardElem);
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