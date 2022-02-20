import Player from "./Player";

export default class Game {
    _players: Player[] = [];

    constructor(players = 3, startingCards = 6)
    {
        for(let i = 0; i < players; i++)
        {
            const temp = new Player();
            this._players.push(temp);
            for(let j = 0; j < startingCards; j++)
            {
                temp.drawCard();
            }
        }
    }
}
