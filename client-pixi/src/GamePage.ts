import * as PIXI from "pixi.js";

import State from "./State";

import Hand from "./classes/Hand";
import Player from "./classes/Player";
import CardStack from "./classes/CardStack";

export default class GamePage extends PIXI.Container {
    readonly cardStack = new CardStack();
    #hand;
    #players: {[key: string]: Player} = {};

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
        },{
            id: "11",
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

            this.addChild(temp);
            this.#players[player.id] = temp;
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

        // Update player positions
        const players: Player[] = Object.values(this.#players);
        const allX = window.innerWidth + (window.innerHeight * 2); // x "wraps" around available area
        const xInterval = allX / players.length;
        for(let i = 0; i < players.length; i++)
        {
            const player: Player = players[i];
            let position = {
                x: 0,
                y: xInterval * (i + 1),
            };

            if(position.y > window.innerHeight && position.y < (window.innerHeight + window.innerWidth)) // x axis
            {
                position.x = position.y - window.innerHeight;
                position.y = 0;
            }else if(position.y > (window.innerHeight + window.innerWidth)) // Right y-axis
            {
                position.y = Math.min(position.y - (window.innerHeight + window.innerWidth), window.innerHeight - player.height);
                position.x = window.innerWidth - player.width;
            }

            player.x = Math.min(position.x, window.innerWidth - player.width);
            player.y = position.y;
        }
    }

};