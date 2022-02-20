import uid from "uid-safe";
import Player from "./Player";

export default class Card {
    id = uid.sync(18);
    parent: Player;
    
    type: "1"|"2"|"3"|"4"|"5"|"6"|"7"|"8"|"9"|"reverse"|"skip"|"wild"|"+1"|"+4";
    color: "red"|"blue"|"green"|"yellow";

    constructor(type, parent)
    {
        this.type = type;
        this.parent = parent;
    }

    play()
    {
        switch(this.type)
        {
            case "reverse":

            break;
        }

        this.parent.removeCard(this);
    }
}