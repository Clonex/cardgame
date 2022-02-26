import {types} from "./utils";

export function getImage(color, type)
{
    let ret = process.env.PUBLIC_URL + "/images/cards/large/card_back_alt_large.png";
    if(color)
    {
        ret = process.env.PUBLIC_URL + "/images/cards/large/";
        if(type !== "PLUS4" && type !== "wild")
        {
            ret += `${color}_`;
        }
        ret += `${types[type]}_large.png`;
    }
    return ret;
};
export default function Card(props)
{

    return <img
    src={getImage(props.color, props.type)}
    className="card" 
    
    style={{"--i": props.i}}
    onDragStart={e => {
        e.preventDefault();
        e.target.click();
    }}
    onClick={props.onClick}
    />;
}