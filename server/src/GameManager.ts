import Game from "./Game";

export default class GameManager {
    games: Game[] = [];
    ws;

    constructor(ws)
    {
        this.ws = ws;
    }

    startGame(playerSize, options?)
    {
        const game = new Game(playerSize);
        this.games.push(game);

        return game;
    }

    getGame(id)
    {
        return this.games.find(game => game.id === id);
    }

    killConnection(conn)
    {
        console.log("Kill connection", conn.player);
        if(conn.player)
        {
            conn.player.connection = false;
        }
    }

    parseData(d, conn)
    {
        const data = JSON.parse(d);

        console.log("GOt someting", data);
        switch(data.cmd)
        {
            case "startGame":
            {
                const game = this.startGame(data.size);

                this.send({
                    cmd: data.cmd,
                    id: game.id,
                }, conn);
            }
            break;
            case "joinGame":
            {
                const game = this.getGame(data.gameID);
                if(game)
                {
                    const player = game.getPlayer(data.playerID);
                    console.log("Joining!", player);
                    if(player && !player.connection)
                    {
                        player.connection = conn;
                        conn.player = player;

                        this.send({
                            cmd: data.cmd,
                            id: player.id,
                        }, conn);
                    }
                }
            }
            break;
            case "getPlayers":
            {
                const game = this.getGame(data.id);
                if(game)
                {
                    const player = game.getPlayer(data.playerID);
                    if(player)
                    {
                        player.connection = conn;
                        conn.player = player;
                    }
                    this.send({
                        cmd: data.cmd,
                        players: game._players.map(player => ({
                            id: player.id,
                            open: !player.connection,
                        })),
                    }, conn);
                }
            }
            break;
            case "ping":
                this.send({
                    cmd: "pong"
                }, conn);
            break;
        }
    }

    send(data, conn)
    {
        conn.send(JSON.stringify(data));
    }
}