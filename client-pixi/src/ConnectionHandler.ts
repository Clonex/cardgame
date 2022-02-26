import {SERVER_IP} from "./utils";

import Response from "./classes/Response";

export default class ConnectionHandler {
    ws = new WebSocket(SERVER_IP);
    #connectionPromises = [];


    constructor()
    {
        this.ws.onopen = () => this.#onReady();
        // this.ws.onclose = () => window.location.reload();
        this.ws.onmessage = data => this.#data(data);
    }

    #onReady()
    {
        this.#connectionPromises.forEach(resolve => resolve(true));
        this.send({cmd: "ping"});
        setInterval(() =>  this.send({cmd: "ping"}), 1000 * 60 * 2);
    }

    #data(data)
    {

    }

    get onReady()
    {
        return new Promise(r => {
            if(this.ws.readyState === 1)
            {
                r(true);
            }else if(this.ws.readyState > 1)
            {
                r(false);
            }else{
                this.#connectionPromises.push(r);
            }
        });
    }

    send(data: Response<T>): void
    {
        this.ws.send(JSON.stringify(data));
    }
};