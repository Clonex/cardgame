import uid from "uid-safe";
import Card from "./Card";
import Game from "./Game";

export default class Player {
    id = uid.sync(18);
    cards: Card[] = [];
    parent: Game;

    constructor(game)
    {
        this.parent = game;
    }

    drawCard()
    {
        const type = "1"; // TODO: random card type
        const temp = new Card(type, this);

        this.cards.push(temp);
        return temp;
    }

    removeCard(card)
    {
        this.cards = this.cards.filter(d => d !== card);
    }

    play(cardID)
    {
        const card = this.cards.find(card => card.id === cardID);
        card?.play(this.parent);

        return card;
    }
}