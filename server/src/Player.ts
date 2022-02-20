import uid from "uid-safe";
import Card from "./Card";
import Game from "./Game";

export default class Player {
    id = uid.sync(18);
    cards: Card[] = [];
    parent: Game;
    didDraw = false;
    didPlay = false;

    connection;

    constructor(game)
    {
        this.parent = game;
    }

    drawCard()
    {
        let temp;
        for(let i = 0; i < this.parent.drawBuffer; i++)
        {
            const type = "1"; // TODO: random card type
            const color = "red"; // TODO: random card type
            temp = new Card(type, color, this);
            
            this.cards.push(temp);
            this.didDraw = true;
        }
        this.parent.drawBuffer = 1;

        return temp;
    }

    removeCard(card)
    {
        this.cards = this.cards.filter(d => d !== card);
    }

    turnReset()
    {
        this.didPlay = false;
        this.didDraw = false;
    }

    play(cardID)
    {
        const card = this.cards.find(card => card.id === cardID);
        card?.play(this.parent);

        this.didPlay = true;

        return card;
    }
}