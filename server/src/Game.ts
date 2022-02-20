import uid from "uid-safe";
import Player from "./Player";
import Card from "./Card";

export default class Game {
    id = uid.sync(18);
    currentTurn: number = 0;
    _players: Player[] = [];
    cardStack: Card[] = [];

    direction: "left"|"right" = "left";

    constructor(players = 3, startingCards = 6)
    {
        for(let i = 0; i < players; i++)
        {
            const temp = new Player(this);
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
            const card = player.play(cardID);
            if(card?.playable(this.cardStack[0]))
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

    get nextPlayer()
    {
        this.nextTurn(); // Hacky method?? Go to next player and save it, then go back to the last player
        const player = this.currentPlayer;
        this.direction = this.direction === "left" ? "right" : "left";
        this.nextTurn();
        this.direction = this.direction === "left" ? "right" : "left";

        return player;
    }

    get currentPlayer() {
        return this._players[this.currentTurn];
    }
}