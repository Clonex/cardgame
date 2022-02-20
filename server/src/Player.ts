import uid from "uid-safe";
import Card from "./Card";

export default class Player {
    id = uid.sync(18);
    cards: Card[] = [];

    drawCard()
    {
        const type = 1; // TODO: random card type
        const temp = new Card(type, this);

        this.cards.push(temp);
        return temp;
    }

    removeCard(card)
    {
        this.cards = this.cards.filter(d => d !== card);
    }

    play(cardID, game)
    {
        const card = this.cards.find(card => card.id === cardID);
        card?.play(game);

        return card;
    }
}