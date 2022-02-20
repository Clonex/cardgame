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
        conn.player.connection = false;
    }

    parseData(data, conn)
    {
        switch(data.cmd)
        {
            case "startGame":
            {
                const game = this.startGame(data.size);

                conn.send(JSON.stringify({
                    cmd: data.cmd,
                    id: game.id,
                }));
            }
            break;
            case "joinGame":
            {
                const game = this.getGame(data.id);
                if(game)
                {
                    const player = game.getPlayer(data.playerID);
                    if(player)
                    {
                        player.connection = conn;
                        conn.player = player;

                        conn.send(JSON.stringify({
                            cmd: data.cmd,
                            id: player.id,
                        }));
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
                    conn.send(JSON.stringify({
                        cmd: data.cmd,
                        players: game._players.map(player => ({
                            id: player.id,
                            open: !!player.connection,
                        })),
                    }));
                }
            }
            break;
        }
    }
}