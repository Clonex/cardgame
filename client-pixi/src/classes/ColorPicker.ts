import * as PIXI from "pixi.js";

import State from "../State";

export default class ColorPicker extends PIXI.Container {
    readonly bg = new PIXI.Graphics();
    readonly container = new PIXI.Container();

    visible = false;
    interactive = true;

    constructor()
    {
        super();

        const boxBG = new PIXI.Graphics();
        boxBG.beginFill(0xFFFFFF).drawRect(0, 0, 800, 400);
        this.container.addChild(boxBG);

        this.addChild(this.bg, this.container);

        State.events.on("resize", () => this.updateSize());
        this.updateSize();
    }

    show()
    {
        
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