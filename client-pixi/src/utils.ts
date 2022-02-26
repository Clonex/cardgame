export const SERVER_IP = process.env.NODE_ENV === "production" || 1 ? "wss://cardapi.clonex.dk" : "ws://localhost:8080";


import * as PIXI from "pixi.js";
export function draggable<T extends PIXI.Container>(target: T)
{
    target.interactive = true;
    
    let move = false;
    target.on("pointerdown", () => move = true);
    target.on("pointerup", () => move = false);
    target.on("pointermove", e => {
        if(move)
        {
            const {x, y} = e.data.getLocalPosition(target.parent);
            target.x = x - (target.width / 2);
            target.y = y - (target.height / 2);
            target.emit("moved");
        }
    });

    return target;
};