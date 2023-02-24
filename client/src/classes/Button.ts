import * as PIXI from 'pixi.js';

export class Button extends PIXI.Container {
	static INIT_ALPHA = 0.8;
	interactive = true;
	cursor = 'pointer';

	constructor(
		text: string,
		textColor = 0xffffff,
		bgColor = 0xff2525,
		height = 50
	) {
		super();

		const textElem = new PIXI.Text(text, {
			fill: textColor,
		});

		const bg = new PIXI.Graphics();
		bg.beginFill(bgColor)
			.drawRect(0, 0, textElem.width + 15, height)
			.endFill();

		textElem.anchor.set(0.5);
		textElem.x = bg.width / 2;
		textElem.y = bg.height / 2;

		bg.alpha = Button.INIT_ALPHA;
		this.on('pointerover', () => (bg.alpha = 1));
		this.on('pointerout', () => (bg.alpha = Button.INIT_ALPHA));

		this.addChild(bg, textElem);
	}
}
