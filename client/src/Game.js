import Player from "./Player";
export default function Game(props)
{
    return (<div>
        {
            props.players.map(player => <Player cards={player.cards} id={player.id} connection={props.connection} />)
        }

        <button onClick={() => props.connection.send({cmd: "drawCard"})}>
            Draw card
        </button>

        <button onClick={() => props.connection.send({cmd: "endTurn"})}>
            End turn
        </button>
    </div>);
}