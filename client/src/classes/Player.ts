import * as PIXI from "pixi.js";

import {Card, PICKER_TYPES, SERVER_CARD} from "./Card";

export interface localStorageData {
    gameID: string,
    playerID: string,
};

export class Player extends PIXI.Container {
    cards: SERVER_CARD[] = [];
    cardElems: Card[] = [];

    readonly cardContainer = new PIXI.Container();
    readonly background = new PIXI.Graphics();
    id;

    constructor(id: string)
    {
        super();

        this.id = id;
        this.background.visible = false;
        this.addChild(this.background, this.cardContainer);
    }

    setCards(cards: SERVER_CARD[])
    {
        this.cardContainer.removeChildren();
        this.cards = cards;

        this.cardElems = [];
        this.cards.forEach((card, i) => {
            const IS_PICK = PICKER_TYPES.includes(card.type ?? "none");
            const cardElem = new Card(card.type ?? "none", IS_PICK ? "none" : (card.color ?? "none"), card.id);
            cardElem.x = i * (cardElem.width * 0.2);

            this.cardContainer.addChild(cardElem);
            this.cardElems.push(cardElem);
        });

        this.background.clear();
        this.background.beginFill(0xFFFFFF, 0.5).drawRoundedRect(-10, -10, this.cardContainer.width + 20, this.cardContainer.height + 20, 10);
    }

    showBackground(visible: boolean)
    {
        this.background.visible = visible;
    }

    getCardElem(id: string)
    {
        console.log("Yo", id, this.cardElems);
        return this.cardElems.find(card => card.id === id);
    }
};