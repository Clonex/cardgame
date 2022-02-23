import Player from "./Player";
import {getImage} from "./utils";

export default function Game(props)
{
    if(props.players.length === 0)
    {
        return null;
    }
    const me = props.players.find(player => player.cards?.[0].color);
    return (<div>
        <div className="players" style={{"--players": props.players.length - 1}} key={props.players.length}>
        {
            props.players.map((player, i) => player.id !== me.id && <Player
                cards={player.cards}
                id={player.id}
                i={i}
                highlight={player.id === props.currentTurn}
                totalPlayers={props.players.length}
                connection={props.connection}
                key={player.id}
            />)
        }
        </div>
        <div className="myPlayer">
            <Player
                cards={me.cards}
                id={me.id}
                highlight={me.id === props.currentTurn}
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

        {
            me.id === props.currentTurn && <div className="settings">
                <button onClick={() => props.connection.send({cmd: "drawCard"})}>
                    Draw card
                </button>

                <button onClick={() => props.connection.send({cmd: "endTurn"})}>
                    End turn
                </button>
            </div>
        }
    </div>);
}