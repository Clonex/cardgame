import uid from "uid-safe";
import Player from "./Player";
import Game from "./Game";

export default class Card {
    id = uid.sync(18);
    parent: Player;
    
    type: "1"|"2"|"3"|"4"|"5"|"6"|"7"|"8"|"9"|"reverse"|"skip"|"wild"|"+1"|"+4";
    color: "red"|"blue"|"green"|"yellow"|"none";

    constructor(type: Card['type'], color: Card['color'], parent)
    {
        this.type = type;
        this.color = color;
        this.parent = parent;
    }

    play(game: Game, color?: Card['color'])
    {
        const nextPlayer = game.nextPlayer;
        switch(this.type)
        {
            case "reverse":
                game.direction = game.direction === "left" ? "right" : "left";
            break;
            case "skip":
                // game.nextTurn();
                game.turnIncrementSize++;
            break;
            case "wild":
                this.color = color;
            break;
            case "+4":
                this.color = color;
                game.drawBuffer += 4;
                // for(let i = 0; i < 4; i++){
                //     nextPlayer.drawCard();
                // }
            break;
            case "+1":
                this.color = color;
                // nextPlayer.drawCard();
                
                game.drawBuffer += 1;
            break;
        }

        this.parent.removeCard(this);
    }

    playable(lastCard?: Card)
    {
        return  !lastCard ||    // Empty draw pile
                !(this.parent.parent.drawBuffer > 0 && lastCard.type !== this.type) || // Player can only put down a +1/+4 card if there is something in drawBuffer
                lastCard.color === this.color; // Last card has same color as current
    }
}