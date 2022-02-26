import * as PIXI from "pixi.js";

import Card from "./Card";

export default class Plauer extends PIXI.Container {
    #cards = [];

    readonly cardContainer = new PIXI.Container();
    readonly id;

    constructor(id: string)
    {
        super();

        this.id = id;

        this.addChild(this.cardContainer);
    }


    setCards(cards)
    {
        this.cardContainer.removeChildren();
        this.#cards = cards;

        this.#cards.forEach((card, i) => {
            const cardElem = new Card(card.type, card.color);
            cardElem.x = i * (cardElem.width * 0.2);

            this.addChild(cardElem);
        });
    }
};