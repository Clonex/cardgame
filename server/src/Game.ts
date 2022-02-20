import Player from "./Player";
import Card from "./Card";

export default class Game {
    currentTurn: number = 0;
    _players: Player[] = [];
    cardStack: Card[] = [];

    direction: "left"|"right" = "left";

    constructor(players = 3, startingCards = 6)
    {
        for(let i = 0; i < players; i++)
        {
            const temp = new Player();
            // if(!this.currentTurn)
            // {
            //     this.currentTurn = temp.id;
            // }

            this._players.push(temp);
            for(let j = 0; j < startingCards; j++)
            {
                temp.drawCard();
            }
        }
    }

    play(playerID, cardID)
    {
        const player = this.getPlayer(playerID);
        if(this.currentTurn === this._players.indexOf(player) && player)
        {
            const card = player.play(cardID, this);
            if(card.playable(this.cardStack[0]))
            {
                if(card)
                {
                    this.cardStack.push(card);
                }
                this.nextTurn();
            }
        }
    }

    getPlayer(playerID)
    {
        return this._players.find(player => player.id === playerID);
    }

    nextTurn()
    {
        if(this.direction === "left")
        {
            this.currentTurn = (this.currentTurn + 1) % this._players.length;
        }else{
            this.currentTurn = this.currentTurn - 1;
            if(this.currentTurn < 0)
            {
                this.currentTurn = this._players.length - 1;
            }
        }
    }

    nextPlayer()
    {
        this.nextTurn(); // Hacky method??
        const player = this._players[this.currentTurn];
        this.direction = this.direction === "left" ? "right" : "left";
        this.nextTurn();
        this.direction = this.direction === "left" ? "right" : "left";

        return player;
    }
}
