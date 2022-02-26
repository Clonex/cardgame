import {SERVER_IP} from "./utils";

export default class ConnectionHandler {
    ws = new WebSocket(SERVER_IP);
    gameID = false;
    onReady = () => {};

    constructor(parent)
    {
        this.parent = parent;

        this.ws.onopen = () => {
            this.onReady();
            setInterval(() =>  this.send({cmd: "ping"}), 1000 * 60 * 2);
        };
        this.ws.onmessage = data => this.onData(data);
        this.ws.onclose = () => window.location.reload();
    }

    onData(d)
    {
        const data = JSON.parse(d.data);
        switch(data.cmd)
        {
            case "startGame":
                this.gameID = data.id;
                this.parent.setState({
                    gameID: data.id,
                });
                this.send({
                    cmd: "joinGame",
                    gameID: data.id,
                    playerID: false
                });
                // this.send({
                //     cmd: "getPlayers",
                //     id: data.id
                // });
            break;
            case "joinGame":
                // this.gameID = data.id;
                // this.parent.setState({
                //     gameID: data.id,
                // });
                // this.send({
                //     cmd: "getPlayers",
                //     id: data.id
                // });
                if(!data.id)
                {
                    window.location = "/";
                }else{
                    this.send({
                        cmd: "getCards"
                    });
                }
            break;
            case "getCards":
                this.parent.setState({
                    players: data.players, 
                    currentTurn: data.currentTurn, 
                });
            break;
            case "cardStack":
                this.parent.setState({
                    cardStack: data.stack, 
                });
            break;
            case "playCard":
                // this.parent.setState({
                //     cardStack: data.stack, 
                // });
                this.parent.animateCard(data.color, data.type, data.playerID);
            break;
            case "getPlayers": 
                // if(!this.parent.state.playerID)
                // {
                //     const player = data.players.find(player => player.open);
                //     console.log("New player", player);
                //     if(player)
                //     {
                //         this.parent.setState({
                //             playerID: player.id,
                //         });
                //         if(!this.gameID)
                //         {
                //             this.send({
                //                 cmd: "joinGame",
                //                 gameID: this.parent.state.gameID,
                //                 playerID: player.id
                //             });
                //         }
                //     }else{
                //         this.send({
                //             cmd: "joinGame",
                //             gameID: this.parent.state.gameID,
                //             playerID: false
                //         });
                //     }
                //     this.gameID = data.id;
                // }
            break;
        }
        console.log("Got something", data);
    }

    send(data)
    {
        this.ws.send(JSON.stringify(data))
    }
}