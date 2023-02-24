import { Application } from 'pixi.js';
import { GAME_WIDTH, GAME_HEIGHT } from './constants';
import State from './State';
import { WelcomePage, GamePage } from './pages';

export class Game {
	app = new Application({
		width: GAME_WIDTH,
		height: GAME_HEIGHT,
		backgroundAlpha: 0,
	});

	constructor() {
		window.addEventListener('resize', () => this.setSize());
		document.body.appendChild(this.app.view as unknown as Node);
		this.app.renderer.resize(window.innerWidth, window.innerHeight);
	}

	setSize() {
		this.app.renderer.resize(window.innerWidth, window.innerHeight);
		State.centerElems.forEach((container) => {
			container.x = window.innerWidth / 2 - container.width / 2;
			container.y = window.innerHeight / 2 - container.height / 2;
		});
		State.events.emit('resize');
	}

	render() {
		const gamePage = new GamePage();
		State.gameView = gamePage;

		const page = new WelcomePage();
		page.onStart = () => {
			State.connection.send({
				cmd: 'startGame',
			});
			page.alpha = 0;
			page.interactive = false;

			this.app.stage.addChild(gamePage);
		};

		State.connection.onReady.then(() => {
			this.app.stage.addChild(page);

			if (window.location.hash.includes('/game/')) {
				gamePage.joinGame();
				page.alpha = 0;
				page.interactive = false;

				this.app.stage.addChild(gamePage);
			}
		});
		State.centerElems.push(page);
		this.setSize();

		(window as any).gameData = {
			State,
			app: this.app,
		};
	}
}
