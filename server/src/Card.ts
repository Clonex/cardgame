import uid from "uid-safe";
import Player from "./Player";
import Game from "./Game";

export default class Card {
    id = uid.sync(18);
    parent: Player;
    
    type: "1"|"2"|"3"|"4"|"5"|"6"|"7"|"8"|"9"|"reverse"|"skip"|"wild"|"+1"|"+4";
    color: "red"|"blue"|"green"|"yellow"|"none";

    constructor(type, parent)
    {
        this.type = type;
        this.parent = parent;
    }

    play(game: Game, color?: "red"|"blue"|"green"|"yellow")
    {
        const nextPlayer = game.nextPlayer();
        switch(this.type)
        {
            case "reverse":
                game.direction = game.direction === "left" ? "right" : "left";
            break;
            case "skip":
                game.nextTurn();
            break;
            case "wild":
                this.color = color;
            break;
            case "+4":
                this.color = color;
                for(let i = 0; i < 4; i++){
                    nextPlayer.drawCard();
                }
            break;
            case "+1":
                this.color = color;
                nextPlayer.drawCard();
            break;
        }

        this.parent.removeCard(this);
    }

    playable(lastCard?: Card)
    {
        if(lastCard && lastCard.color !== this.color)
        {
            return false;
        }

        return true;
    }
}