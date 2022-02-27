import {SERVER_IP} from "./utils";

import State from "./State";
// import Response from "./classes/Response";

export default class ConnectionHandler {
    ws?:WebSocket;
    #connectionPromises = [];
    pintInterval?: NodeJS.Timeout;


    constructor()
    {
        this.openConnection();
    }

    openConnection()
    {
        this.ws = new WebSocket(SERVER_IP);
        this.ws.onopen = () => this.#onReady();
        this.ws.onclose = () => setTimeout(() => this.openConnection(), 200);
        this.ws.onmessage = data => this.#data(data);
    }

    #onReady()
    {
        this.#connectionPromises.forEach(resolve => resolve(true));
        this.send({cmd: "ping"});

        if(this.pintInterval)
        {
            clearInterval(this.pintInterval);
        }
        this.pingInterval = setInterval(() =>  this.send({cmd: "ping"}), 1000 * 60 * 2);
    }

    #data(d)
    {
        const data = JSON.parse(d.data);
        const game = State.gameView;
        console.log("Got something", data);

        switch (data.cmd)
        {
            case "startGame":
                window.location.hash = `/game/${data.id}`;
                this.send({
                    cmd: "joinGame",
                    gameID: data.id,
                });
                game.id = data.id;
            break;
            case "joinGame":
                if(!data.id)
                {
                    window.location.assign("/");
                }else{
                    game.hand.id = data.id;
                    this.send({
                        cmd: "getCards"
                    });
                }
            break;
            case "getCards":
                for(let i = 0; i < data.players.length; i++)
                {
                    const player = data.players[i];
                    if(player.id === game.hand.id)
                    {
                        game.hand.setCards(player.cards);
                    }else{
                        game.setCards(player.id, player.cards);
                    }
                }
                game.setTurn(data.currentTurn);
                game.updatePosition();
            break;
        }
    }

    get onReady()
    {
        return new Promise(r => {
            if(this.ws?.readyState === 1)
            {
                r(true);
            }else if((this.ws?.readyState ?? 0) > 1)
            {
                r(false);
            }else{
                this.#connectionPromises.push(r);
            }
        });
    }

    send(data: {[key: string]: string|number}): void
    {
        this.ws?.send(JSON.stringify(data));
    }
};