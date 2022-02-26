export const SERVER_IP = process.env.NODE_ENV === "production" || 1 ? "wss://cardapi.clonex.dk" : "ws://localhost:8080";


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

export function hashRouter()
{
    const currentLocation = () => window.location.hash.replace(/^#/, "") || "/";
    const navigate = (to) => (window.location.hash = to);

    return [currentLocation(), navigate];
};