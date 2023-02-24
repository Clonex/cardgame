export const SERVER_IP = process.env.NODE_ENV === "production"  ? "wss://cardapi.clonex.dk" : "ws://localhost:8182";

import * as PIXI from "pixi.js";
import {TimedAnimation} from "./classes/animation";

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
}

/**
 * Checks wether @param elem is within @param target.
 * @param elem 
 * @param target 
 * @returns boolean
 */
export function isWithin<T extends PIXI.Container, B extends PIXI.Container>(elem: T, target: B)
{
	const targetPos = target.getGlobalPosition();
	const elemPos = elem.getGlobalPosition();
    
	return  (elemPos.x >= targetPos.x && (targetPos.x + target.width) > elemPos.x) && // x
            (elemPos.y >= targetPos.y && (targetPos.y + target.height) > elemPos.y);   // y;
}

export function clamp(value: number, min: number, max: number)
{
	return Math.max(Math.min(value, min), max);
}

export function scaleTo(targetScale: number, element: PIXI.Container, time: number)
{
	const startScale = element.scale.x;
	const diff = targetScale - startScale;
	TimedAnimation.run(p => {
		element.scale.set(startScale + (diff * p));
	}, time);
}