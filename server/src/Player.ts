import uid from "uid-safe";
import Card from "./Card";
import Game from "./Game";
import {Types, Colors} from "./Card";
import {randomEnumValue} from "./utils";

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
            const type = randomEnumValue(Types);
            const color = randomEnumValue(Colors, 1);
            temp = new Card(type, color, this);
            
            this.cards.push(temp);
            this.didDraw = true;
        }
        this.parent.drawBuffer = 1;

        return temp;
    }

    getCard(cardID)
    {
        return this.cards.find(card => card.id === cardID);
    }

    removeCard(card)
    {
        this.cards = this.cards.filter(d => d !== card);
    }

    inactive()
    {
        if(this.parent._players.some(player => player.id === this.id))
        {
            const currPlayer = this.parent.currentPlayer;
            this.parent._players = this.parent._players.filter(player => player.id !== this.id);
            this.parent.currentTurn = this.parent._players.findIndex(player => currPlayer.id === player.id);
            this.parent._inactivePlayers.push(this);
        }
    }

    activate()
    {
        if(this.parent._inactivePlayers.some(player => player.id === this.id))
        {
            this.parent._inactivePlayers = this.parent._inactivePlayers.filter(player => player.id !== this.id);
            this.parent._players.push(this);
        }
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