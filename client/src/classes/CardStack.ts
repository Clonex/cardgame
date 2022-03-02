import * as PIXI from "pixi.js";

import Card from "./Card";

export default class CardStack extends PIXI.Container {
    static RADIUS = 150;
    
    readonly cardContainer = new PIXI.Container();
    #cards = [];
    constructor()
    {
        super();

        const bg = new PIXI.Graphics();
        bg.beginFill(0xFFFFFF).drawCircle(CardStack.RADIUS, CardStack.RADIUS, CardStack.RADIUS);

        this.cardContainer.x = CardStack.RADIUS - (Card.WIDHT / 2);
        this.cardContainer.y = CardStack.RADIUS - (Card.HEIGHT / 2);

        this.addChild(bg, this.cardContainer);
    }

    setCards(cards)
    {
        this.cardContainer.removeChildren();
        this.#cards = cards;

        this.#cards.forEach((card, i) => {
            const cardElem = new Card(card.type ?? "none", card.color ?? "none");
            // cardElem.x = i * (cardElem.width * 0.2);

            this.cardContainer.addChild(cardElem);
        });
    }
}