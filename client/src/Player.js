import {getImage} from "./utils";

import "./Player.css";

const types = {
    ZERO: "0",
    ONE: "1",
    TWO: "2",
    THREE: "3",
    FOUR: "4",
    FIVE: "5",
    SIX: "6",
    SEVEN: "7",
    EIGHT: "8",
    NINE: "9",
    reverse: "reverse",
    skip: "skip",
    wild: "wild",
    PLUS1: "picker",
    PLUS4: "wild_pick_four"
};


function rads(degrees)
{
  return degrees * (Math.PI / 180);
}

export default function Player(props)
{
    console.log("Player", props.cards);
    // const step = (2*Math.PI) / props.totalPlayers;
    // const x = Math.round((100 * Math.cos(props.i*(2*Math.PI/15))));
    // const x = Math.round(20 * Math.cos(step * props.i)) + 25;
    
    // const tempRadius = 50;
    // const size = 10;
    // const startAngle = props.i * size;
    
    // const endAngle = size + startAngle;
    // const avgRad = tempRadius;
    // const avgAngle = ((rads(startAngle) + rads(endAngle))/2);

    // const x = (Math.cos(avgAngle) * avgRad);
    // const y = (Math.sin(avgAngle) * avgRad)

    const size = 800;
    let dangle = 240 / props.totalPlayers;
    let angle = (240 - 90) + (dangle * props.i);

    const IS_MINE = props.cards?.[0].color;
    // const CARD_PADDING = IS_MINE ? 80 : 10;
    console.log(`rotate(${angle}deg) translate(${300 / 2}px) rotate(-${angle}deg)`);
    return (<div className={"player" + (IS_MINE ? " me" : "")} style={{transform: `rotate(${angle}deg) translate(${size / 2}px) rotate(-${angle}deg)`}}>
        PLAYER
        <div className="cards">
            {
                props.cards.map((card, i) => <img 
                    className="card" 
                    src={getImage(card.color, card.type)} 
                    // style={{marginLeft: `${i * CARD_PADDING}px`}}
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