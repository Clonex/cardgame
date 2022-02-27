import * as PIXI from "pixi.js";

import State from "./State";

import Button from "./classes/Button";
import Hand from "./classes/Hand";
import Player from "./classes/Player";
import CardStack from "./classes/CardStack";
import ColorPicker from "./classes/ColorPicker";

export default class GamePage extends PIXI.Container {
    readonly cardStack = new CardStack();
    id = "0";

    readonly hand;
    #players: {[key: string]: Player} = {};

    #colorPicker = new ColorPicker();

    #playerContainer = new PIXI.Container();
    #buttonContainer = new PIXI.Container();
    #drawButton = new Button("Draw", 0xFFFFFF, 0x333333);
    #endTurn = new Button("End turn", 0xFFFFFF, 0x333333);

    #currentTurn = "0";

    constructor()
    {
        super();

        this.hand = new Hand("");
        // this.hand.setCards([1,2,3]);

        this.#endTurn.x = this.#drawButton.width + 20;

        this.#buttonContainer.addChild(this.#endTurn, this.#drawButton);
        this.addChild(this.cardStack, this.#buttonContainer, this.#playerContainer, this.hand);

        // let players = [{
        //     id: "10",
        //     cards: [{
        //         color: "none",
        //         type: "none",
        //     },{
        //         color: "none",
        //         type: "none",
        //     },{
        //         color: "none",
        //         type: "none",
        //     }],
        // },{
        //     id: "11",
        //     cards: [{
        //         color: "none",
        //         type: "none",
        //     },{
        //         color: "none",
        //         type: "none",
        //     },{
        //         color: "none",
        //         type: "none",
        //     }],
        // }];
        // for(let i = 0; i < players.length; i++)
        // {
        //     const player = players[i];
        //     const temp = new Player(player.id);
        //     temp.setCards(player.cards);

        //     this.addChild(temp);
        //     this.#players[player.id] = temp;
        // }

        this.addChild(this.#colorPicker);

        State.events.on("resize", () => this.updatePosition());
        this.updatePosition();
        this.setTurn(false);
    }

    setCards(id: string, cards)
    {
        let player = this.getPlayer(id);
        if(!player)
        {
            player = new Player(id);
            this.#playerContainer.addChild(player);
            this.#players[player.id] = player;
        }

        player.setCards(cards);

        this.updatePosition();
    }

    getPlayer(id)
    {
        return this.#players[id];
    }

    setTurn(playerID: string)
    {
        this.#currentTurn = playerID;
        if(playerID === this.hand.id)
        {
            this.#drawButton.interactive = true;
            this.#endTurn.interactive = true;
            this.#buttonContainer.alpha = 1;
        }else{
            this.#drawButton.interactive = false;
            this.#endTurn.interactive = false;
            this.#buttonContainer.alpha = 0.2;
        }
    }

    updatePosition()
    {
        // Update card stack position
        this.cardStack.x = (window.innerWidth / 2) - (this.cardStack.width / 2);
        this.cardStack.y = (window.innerHeight / 2) - (this.cardStack.height / 2);

        // Update hand poistion
        this.hand.y = window.innerHeight - this.hand.height - 10;
        this.hand.x = (window.innerWidth / 2) - (this.hand.width / 2);

        // Button container position
        this.#buttonContainer.x = (window.innerWidth / 2) - (this.#buttonContainer.width / 2);
        this.#buttonContainer.y = this.hand.y - this.#buttonContainer.height - 10;

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