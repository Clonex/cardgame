import * as PIXI from "pixi.js";

import Card, {PICKER_TYPES} from "./Card";

export default class Plauer extends PIXI.Container {
    #cards = [];

    readonly cardContainer = new PIXI.Container();
    id;

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
            const IS_PICK = PICKER_TYPES.includes(card.type);
            const cardElem = new Card(card.type ?? "none", IS_PICK ? "none" : (card.color ?? "none"));
            cardElem.x = i * (cardElem.width * 0.2);

            this.cardContainer.addChild(cardElem);
        });
    }
};