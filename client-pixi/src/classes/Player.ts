import * as PIXI from "pixi.js";

import Card, {PICKER_TYPES, SERVER_CARD} from "./Card";

export default class Plauer extends PIXI.Container {
    #cards: SERVER_CARD[] = [];

    readonly cardContainer = new PIXI.Container();
    id;

    constructor(id: string)
    {
        super();

        this.id = id;

        this.addChild(this.cardContainer);
    }


    setCards(cards: SERVER_CARD[])
    {
        this.cardContainer.removeChildren();
        this.#cards = cards;

        this.#cards.forEach((card, i) => {
            const IS_PICK = PICKER_TYPES.includes(card.type ?? "none");
            const cardElem = new Card(card.type ?? "none", IS_PICK ? "none" : (card.color ?? "none"));
            cardElem.x = i * (cardElem.width * 0.2);

            this.cardContainer.addChild(cardElem);
        });
    }
};