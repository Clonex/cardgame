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

function getImage(color, type)
{
    let ret = "images/cards/large/card_back_alt_large.png";
    if(color)
    {
        ret = "images/cards/large/";
        if(type !== "PLUS4" && type !== "wild")
        {
            ret += `${color}_`;
        }
        ret += `${types[type]}_large.png`;
    }
    return ret;
}

export default function Player(props)
{
    console.log("Player", props.cards);
    const step = (2*Math.PI) / props.totalPlayers;
    // const x = Math.round((100 * Math.cos(props.i*(2*Math.PI/15))));
    const x = Math.round(20 * Math.cos(step * props.i)) + 25;
    const IS_MINE = props.cards?.[0].color;
    const CARD_PADDING = IS_MINE ? 80 : 10;
    return (<div className={"player" + (IS_MINE ? " me" : "")} style={{left: `${x}vw`, top: `${x}vh`}}>
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