import * as PIXI from "pixi.js";

import State from "./State";

import Hand from "./classes/Hand";
import Player from "./classes/Player";
import CardStack from "./classes/CardStack";

export default class GamePage extends PIXI.Container {
    readonly cardStack = new CardStack();
    #hand;
    #players = {};

    constructor()
    {
        super();

        this.#hand = new Hand("1");
        this.#hand.setCards([1,2,3]);


        this.addChild(this.cardStack, this.#hand);

        let players = [{
            id: "10",
            cards: [{
                color: "none",
                type: "none",
            },{
                color: "none",
                type: "none",
            },{
                color: "none",
                type: "none",
            }],
        }];
        for(let i = 0; i < players.length; i++)
        {
            const player = players[i];
            const temp = new Player(player.id);
            temp.setCards(player.cards);
            console.log(temp, player);

            this.addChild(temp);
            
        }

        
        State.events.on("resize", () => this.updatePosition());
        this.updatePosition();
    }

    updatePosition()
    {
        // Update card stack position
        this.cardStack.x = (window.innerWidth / 2) - (this.cardStack.width / 2);
        this.cardStack.y = (window.innerHeight / 2) - (this.cardStack.height / 2);


        // Update hand poistion
        this.#hand.y = window.innerHeight - this.#hand.height - 10;
        this.#hand.x = (window.innerWidth / 2) - (this.#hand.width / 2);
    }

};