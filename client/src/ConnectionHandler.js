export default class ConnectionHandler {
    ws = new WebSocket("ws://localhost:8080");
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
                // this.gameID = data.id;
                this.parent.setState({
                    gameID: data.id,
                });
                this.send({
                    cmd: "getPlayers",
                    id: data.id
                });
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
                }
                this.send({
                    cmd: "getCards"
                });
            break;
            case "getCards":
                this.parent.setState({
                    players: data.players, 
                });
            break;
            case "cardStack":
                this.parent.setState({
                    cardStack: data.stack, 
                });
            break;
            case "getPlayers": 
                if(!this.parent.state.playerID)
                {
                    const player = data.players.find(player => player.open);
                    console.log("New player", player);
                    if(player)
                    {
                        this.parent.setState({
                            playerID: player.id,
                        });
                        this.send({
                            cmd: "joinGame",
                            gameID: this.parent.state.gameID,
                            playerID: player.id
                        });
                    }
                }
            break;
        }
        console.log("Got something", data);
    }

    send(data)
    {
        this.ws.send(JSON.stringify(data))
    }
}