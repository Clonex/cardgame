export const SERVER_IP = process.env.NODE_ENV === "production" ? "wss://cardgame-three.vercel.app:8080" : "ws://localhost:8080";

export function getImage(color, type)
{
    let ret = "/images/cards/large/card_back_alt_large.png";
    if(color)
    {
        ret = "/images/cards/large/";
        if(type !== "PLUS4" && type !== "wild")
        {
            ret += `${color}_`;
        }
        ret += `${types[type]}_large.png`;
    }
    return ret;
};

export const PICKER_TYPES = ["PLUS4", "wild"];

export const types = {
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

export function rads(degrees)
{
  return degrees * (Math.PI / 180);
};