import {useState, forwardRef} from "react";
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';

import {getImage, PICKER_TYPES} from "./utils";

import Card from "./Card";

import "./Player.css";

export default forwardRef((props, ref) =>
{
    const [showColorPicker, setColorPickerVisibility] = useState(false);
    // console.log("Player", props.cards);

    const setColor = (color) => {
        // console.log("Set color", showColorPicker, color);
        props.connection.send({
            cmd: "playCard",
            color,
            cardID: showColorPicker.id,
        });
        setColorPickerVisibility(false);
    };

    const NAME = uniqueNamesGenerator({
        dictionaries: [adjectives, animals],
        separator: ' ',
        seed: props.id,
      });
    const IS_MINE = props.cards?.[0].color;
    return (<div className={"player" + (IS_MINE ? " me" : "")} style={{"--i": props.totalPlayers === 2 ? 0.52 : props.i}}>
        <div className={"player-title " + (props.highlight ? "turn" : "")}>
            {NAME}
        </div>
        {
            showColorPicker && <div className="colorPicker">
                <button onClick={() => setColor("yellow")} className="color yellow">
                    Yellow
                </button>
                <button onClick={() => setColor("blue")} className="color blue">
                    Blue
                </button>
                <button onClick={() => setColor("red")} className="color red">
                    Red
                </button>
                <button onClick={() => setColor("green")} className="color green">
                    Green
                </button>
            </div>
        }
        
        <div className="cards" ref={ref}>
            {
                props.cards.map((card, i) => <Card 
                    {...card}
                    i={i}
                    onClick={() => {
                        if(PICKER_TYPES.includes(card.type))
                        {
                            setColorPickerVisibility(card);
                        }else{
                            props.connection.send({
                                cmd: "playCard",
                                // playerID: props.id, 
                                cardID: card.id,
                            });
                        }
                    }} 
                    key={card.id}
                />)
            }
        </div>
    </div>);
})