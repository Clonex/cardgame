import Player, {getImage} from "./Player";
export default function Game(props)
{
    return (<div>
        <div className="players">
        {
            props.players.map((player, i) => <Player
                cards={player.cards}
                id={player.id}
                i={i}
                totalPlayers={props.players.length}
                connection={props.connection}
            />)
        }
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