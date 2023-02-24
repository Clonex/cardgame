import * as PIXI from 'pixi.js';

import State from '../State';
import { CardStack, Player, Hand, Button, SERVER_CARD } from '../classes';
import { localStorageData } from '../classes/Player';

export class GamePage extends PIXI.Container {
	readonly cardStack = new CardStack();
	id = '0';

	readonly hand = new Hand('');
	#players: { [key: string]: Player } = {};

	#playerContainer = new PIXI.Container();
	#buttonContainer = new PIXI.Container();
	#drawButton = new Button('Draw', 0xffffff, 0x333333);
	#endTurn = new Button('End turn', 0xffffff, 0x333333);
	#unoButton = new Button('Last card!', 0xffffff, 0x333333);

	#currentTurn = '0';
	interactive = true;
	#debugBackground = new PIXI.Graphics();

	constructor() {
		super();

		this.#endTurn.x = this.#drawButton.width + 20;
		this.#unoButton.x = this.#endTurn.x + this.#endTurn.width + 20;

		this.#buttonContainer.addChild(
			this.#endTurn,
			this.#drawButton,
			this.#unoButton
		);

		this.#drawButton.on('pointerdown', () => {
			State.connection.send({
				cmd: 'drawCard',
			});
		});

		this.#unoButton.on('pointerdown', () =>
			State.connection.send({
				cmd: 'lastCard',
			})
		);

		this.#endTurn.on('pointerdown', () => {
			State.connection.send({
				cmd: 'endTurn',
			});
		});

		this.addChild(
			this.#debugBackground,
			this.cardStack,
			this.#buttonContainer,
			this.#playerContainer,
			this.hand,
			State.colorPicker
		);

		State.events.on('resize', () => this.updatePosition());
		this.updatePosition();
		this.setTurn('n');
	}

	setCards(id: string, cards: SERVER_CARD[]) {
		let player = this.getPlayer(id);
		if (!player) {
			player = new Player(id);
			this.#playerContainer.addChild(player);
			this.#players[player.id] = player;
		}

		player.setCards(cards);

		this.updatePosition();
	}

	getPlayer(id: string) {
		return this.#players[id];
	}

	setTurn(playerID: string) {
		this.#currentTurn = playerID;
		if (playerID === this.hand.id) {
			this.#drawButton.interactive = true;
			this.#endTurn.interactive = true;
			this.#buttonContainer.alpha = 1;
			Object.values(this.#players).forEach((player) =>
				player.showBackground(false)
			);
		} else {
			this.#drawButton.interactive = false;
			this.#endTurn.interactive = false;
			this.#buttonContainer.alpha = 0.2;
			Object.values(this.#players).forEach((player) =>
				player.showBackground(player.id === playerID)
			);
		}
	}

	joinGame() {
		if (window.location.hash.includes('/game/')) {
			const id = window.location.hash.split('/game/')[1];
			let lastPlayerID;
			const localData = localStorage.getItem('playerData');
			if (localData) {
				const lastPlayerData = JSON.parse(localData) as localStorageData;
				if (lastPlayerData.gameID === id) {
					lastPlayerID = lastPlayerData.playerID;
				}
			}

			State.connection.send({
				cmd: 'joinGame',
				gameID: id,
				playerID: lastPlayerID,
			});
		}
	}

	updatePosition() {
		// Update card stack position
		this.cardStack.x = window.innerWidth / 2 - this.cardStack.width / 2;
		this.cardStack.y = window.innerHeight / 2 - this.cardStack.height / 2;

		// Update hand poistion
		this.hand.y = window.innerHeight - this.hand.height - 10;
		this.hand.x = window.innerWidth / 2 - this.hand.width / 2;

		// Button container position
		this.#buttonContainer.x =
			window.innerWidth / 2 - this.#buttonContainer.width / 2;
		this.#buttonContainer.y = this.hand.y - this.#buttonContainer.height - 10;

		// Update player positions
		const players: Player[] = Object.values(this.#players);
		const allX = window.innerWidth + window.innerHeight * 2; // x "wraps" around available area
		const xInterval = allX / players.length;
		for (let i = 0; i < players.length; i++) {
			const player: Player = players[i];
			const position = {
				x: 0,
				y: xInterval * (i + 1),
			};

			if (
				position.y > window.innerHeight &&
				position.y < window.innerHeight + window.innerWidth
			) {
				// x axis
				position.x = position.y - window.innerHeight;
				position.y = 0;
			} else if (position.y > window.innerHeight + window.innerWidth) {
				// Right y-axis
				position.y = Math.min(
					position.y - (window.innerHeight + window.innerWidth),
					window.innerHeight - player.height
				);
				position.x = window.innerWidth - player.width;
			}

			player.x = Math.min(position.x, window.innerWidth - player.width);
			player.y = position.y;
		}

		this.#debugBackground
			.clear()
			.beginFill(0x000000, 0.0001)
			.drawRect(0, 0, window.innerWidth, window.innerHeight)
			.endFill();
	}
}
