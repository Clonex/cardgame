
import * as PIXI from 'pixi.js';

import Button from "./UI/Button";

export default class WelcomePage extends PIXI.Container {
    title = new PIXI.Text("Welcome", {
        fontSize: 48,
        fontFamily: "arial",
        fill: 0xFFFFFF,
        fontWeight: "bolder",
    });

    constructor()
    {
        super();

        const joinBtn = new Button("New game", 0xFFFFFF, 0xffb100);

        joinBtn.y = this.title.height + 20;
        joinBtn.x = (this.title.width / 2) - (joinBtn.width / 2);
        this.addChild(this.title, joinBtn);
    }
};