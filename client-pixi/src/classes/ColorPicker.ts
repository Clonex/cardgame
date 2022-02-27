import * as PIXI from "pixi.js";

import Card from "./Card";
import State from "../State";
import {TimedAnimation} from "./animation";
import {COLORS, Colors} from "./Card";
import {scaleTo} from "../utils";

export default class ColorPicker extends PIXI.Container {
    readonly bg = new PIXI.Graphics();
    readonly container = new PIXI.Container();

    alpha = 0;
    visible = false;
    interactive = true;

    constructor()
    {
        super();

        const boxBG = new PIXI.Graphics();
        boxBG.beginFill(0xFFFFFF).drawRect(0, 0, 692, 280);
        this.container.addChild(boxBG);

        const colorArr = Object.keys(COLORS);
        for(let i = 1; i < colorArr.length; i++)
        {
            const color: Colors = colorArr[i] as Colors;
            const temp = new Card("wild", color);
            temp.scale.set(1.2);
            temp.interactive = true;
            temp.cursor = "pointer";
            temp.on("pointerover", () => scaleTo(1.22, temp, 100));
            temp.on("pointerout", () => scaleTo(1.2, temp, 100));

            temp.y = 20;
            temp.x = (i - 1) * (temp.width + 20) + 20;
            this.container.addChild(temp);
        }

        this.addChild(this.bg, this.container);

        State.events.on("resize", () => this.updateSize());
        this.updateSize();
    }

    show()
    {
        this.visible = true;
        TimedAnimation.run(p =>{
            this.alpha = p;
        }, 100);
    }

    hide()
    {
        TimedAnimation.run(p =>{
            this.alpha = 1 - p;
            if(p === 1)
            {
                this.visible = false;
            }
        }, 100);
    }

    updateSize()
    {
        this.bg.clear();
        this.bg
            .beginFill(0x000000, 0.6)
            .drawRect(0, 0, window.innerWidth, window.innerHeight)
            .endFill();

        this.container.y = (window.innerHeight / 2) - (this.container.height / 2);
        this.container.x = (window.innerWidth / 2) - (this.container.width / 2);
    }
}