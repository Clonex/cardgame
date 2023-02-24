import * as PIXI from 'pixi.js';

import { Button } from '../classes/Button';

export class WelcomePage extends PIXI.Container {
	title = new PIXI.Text('Welcome!', {
		fontSize: 50,
		fontFamily: 'arial',
		fill: 0xffffff,
		fontWeight: 'bolder',
	});
	onStart = () => {
		//
	};

	constructor() {
		super();

		const joinBtn = new Button('New game', 0xffffff, 0xffb100);
		joinBtn.on('pointerdown', () => this.onStart());

		joinBtn.y = this.title.height + 20;
		joinBtn.x = this.title.width / 2 - joinBtn.width / 2;
		this.addChild(this.title, joinBtn);
	}
}
