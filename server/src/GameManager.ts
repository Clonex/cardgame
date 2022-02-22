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
            const player = conn.player;

            player.connection = false;
            player.inactive();
            this.trigger("getCards", player.parent);
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
            case "getCards":
            {
                const player = conn.player;
                if(player)
                {
                    this.trigger("getCards", player.parent);
                }
            }
            break;
            case "playCard":
            {
                const player = conn.player;
                if(player)
                {
                    const card = player.parent.play(player.id, data.cardID);
                    
                    if(card)
                    {
                        this.trigger("getCards", player.parent);
                        this.trigger("cardStack", player.parent);
                        this.trigger("playCard", player.parent, {
                            type: card.type,
                            color: card.color,
                            playerID: player.id,
                        });
                    }
                }
            }
            break;
            case "endTurn":
            {
                const player = conn.player;
                if(player)
                {
                    player.parent.endTurn();
                    this.trigger("getCards", player.parent);
                }
            }
            break;
            case "drawCard":
            {
                const player = conn.player;
                if(player && player.parent.currentPlayer === player)
                {
                    player.drawCard();
                    this.trigger("getCards", player.parent);
                }
            }
            break;
            case "joinGame":
            {
                const game = this.getGame(data.gameID);
                if(game)
                {
                    let player = game.getPlayer(data.playerID, true);
                    if(!player) // Player not found, add it
                    {
                        player = game.addPlayer();
                    }
                    
                    if(player && !player.connection)
                    {
                        player.connection = conn;
                        conn.player = player;
                        player.activate();

                        this.send({
                            cmd: data.cmd,
                            id: player.id,
                        }, conn);
                        this.trigger("cardStack", player.parent);
                    }
                }else{
                    this.send({
                        cmd: data.cmd,
                        id: false,
                    }, conn);
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

    trigger(type, game: Game, extra?: any)
    {
        const send = data => game._players.forEach(player => this.send(data, player.connection));
        switch(type)
        {
            case "playCard":
                send({
                    cmd: "playCard",
                    ...extra
                })
            break;
            case "cardStack":
                send({
                    cmd: type,
                    stack: game.cardStack.map(card => ({
                        type: card.type,
                        color: card.color,
                    })),
                });
            break;
            case "getCards":
                game._players.forEach(player => {
                    this.send({
                        cmd: type,
                        players: game._players.map(p => ({
                            id: p.id,
                            cards: p.cards.map(card => player.id === p.id ? ({
                                id: card.id,
                                type: card.type,
                                color: card.color,
                            }) : ({
                                id: card.id,
                            }))
                        }))
                    }, player.connection);
                });
            break;
        }
    }

    send(data, conn)
    {
        if(conn)
        {
            conn.send(JSON.stringify(data));
        }
    }
}