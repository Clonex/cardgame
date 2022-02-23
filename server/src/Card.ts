import uid from "uid-safe";
import Player from "./Player";
import Game from "./Game";

export enum Types {
    ZERO = "ZERO",
    ONE = "ONE",
    TWO = "TWO",
    THREE = "THREE",
    FOUR = "FOUR",
    FIVE = "FIVE",
    SIX = "SIX",
    SEVEN = "SEVEN",
    EIGHT = "EIGHT",
    NINE = "NINE",
    reverse = "reverse",
    skip = "skip",
    wild = "wild",
    PLUS1 = "PLUS1",
    PLUS4 = "PLUS4"
};

export enum Colors {
    red = "red",
    blue = "blue",
    green = "green",
    yellow = "yellow",
    none = "none"
};

export default class Card {
    id = uid.sync(18);
    parent: Player;
    
    type: Types;
    color: Colors;

    constructor(type: Types, color: Card['color'], parent)
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
            case Types.reverse:
                game.direction = game.direction === "left" ? "right" : "left";
            break;
            case Types.skip:
                // game.nextTurn();
                game.turnIncrementSize++;
            break;
            case Types.wild:
                this.color = color;
            break;
            case Types["+4"]:
                this.color = color;
                game.drawBuffer += 4;
                // for(let i = 0; i < 4; i++){
                //     nextPlayer.drawCard();
                // }
            break;
            case Types["+1"]:
                this.color = color;
                // nextPlayer.drawCard();
                
                game.drawBuffer += 1;
            break;
        }

        this.parent.removeCard(this);
    }

    playable(lastCard?: Card)
    {
        if(lastCard)
        {

            console.log(lastCard.type, "===", this.type);
        }
        return  !lastCard ||    // Empty draw pile
                !(this.parent.parent.drawBuffer > 0 && lastCard.type !== this.type) || // Player can only put down a +1/+4 card if there is something in drawBuffer
                lastCard.type === this.type || // Last card has same type as current
                (lastCard.color === this.color && !this.parent.didPlay); // Last card has same color as current
    }
}