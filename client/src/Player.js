import {getImage} from "./utils";

import "./Player.css";

export default function Player(props)
{
    console.log("Player", props.cards);

    const IS_MINE = props.cards?.[0].color;
    return (<div className={"player" + (IS_MINE ? " me" : "")} style={{"--i": props.totalPlayers === 2 ? 0.5 : props.i}}>
        <div className={"player-title " + (props.highlight ? "turn" : "")}>
            PLAYER {props.i + 1}
        </div>
        <div className="cards">
            {
                props.cards.map((card, i) => <img 
                    className="card" 
                    src={getImage(card.color, card.type)} 
                    onDragStart={e => {
                        e.preventDefault();
                        e.target.click();
                    }}
                    onClick={() => props.connection.send({
                        cmd: "playCard",
                        // playerID: props.id, 
                        cardID: card.id,
                    })} 
                    key={card.id}
                />)
            }
        </div>
    </div>);
}