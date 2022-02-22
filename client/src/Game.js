import Player from "./Player";
import {getImage} from "./utils";

export default function Game(props)
{
    if(props.players.length === 0)
    {
        return null;
    }
    const me = props.players.find(player => player.cards?.[0].color);
    console.log("Hmmmm", props.players);
    return (<div>
        <div className="players" style={{"--players": props.players.length - 1}}>
        {
            props.players.map((player, i) => player.id !== me.id && <Player
                cards={player.cards}
                id={player.id}
                i={i}
                totalPlayers={props.players.length}
                connection={props.connection}
            />)
        }
        </div>
        <div className="myPlayer">
            <Player
                cards={me.cards}
                id={me.id}
                i={0}
                totalPlayers={props.players.length}
                connection={props.connection}
            />
        </div>

        <div className="cardStack">
            {
                props.cardStack.map((card, i) => <img src={getImage(card.color, card.type)} key={i} />)
            }
        </div>

        <button onClick={() => props.connection.send({cmd: "drawCard"})}>
            Draw card
        </button>

        <button onClick={() => props.connection.send({cmd: "endTurn"})}>
            End turn
        </button>
    </div>);
}