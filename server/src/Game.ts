import uid from 'uid-safe';
import Player from './Player';
import Card, { Colors } from './Card';

export default class Game {
	id = uid.sync(18);
	currentTurn = 0;
	_players: Player[] = [];
	_inactivePlayers: Player[] = [];
	active = true;

	cardStack: Card[] = [];

	direction: 'left' | 'right' = 'left';

	turnIncrementSize = 1;
	drawBuffer = 1;

	settings = {
		MUST_DRAW: true,
	};

	_startingCards = 6;

	constructor(players = 0, startingCards = 6) {
		this._startingCards = startingCards;
		for (let i = 0; i < players; i++) {
			this.addPlayer();
		}
	}

	addPlayer() {
		const temp = new Player(this);
		this._players.push(temp);

		for (let j = 0; j < this._startingCards; j++) {
			temp.drawCard();
		}

		temp.didDraw = false;

		return temp;
	}

	play(playerID: string, cardID: string, color: Colors) {
		const player = this.getPlayer(playerID);
		if (
			this.currentTurn === this._players.indexOf(player) &&
			player &&
			this._players.length > 1 &&
			this.active
		) {
			if (this.drawBuffer > 1 && !player.didPlay) {
				this.drawBuffer--;
				player.drawCard();
				this.currentPlayer.didDraw = false;
			}

			const card = player.getCard(cardID);
			if (card?.playable(this.cardStack[this.cardStack.length - 1])) {
				if (player.play(cardID, color)) {
					this.cardStack.push(card);
					return card;
				}
			}
		}
	}

	getPlayer(playerID: string, inactive = false): Player | undefined {
		const target = inactive ? this._inactivePlayers : this._players;
		return target.find((player) => player.id === playerID);
	}

	endTurn() {
		if (
			!this.currentPlayer.didPlay &&
			!this.currentPlayer.didDraw &&
			this.settings.MUST_DRAW
		) {
			this.currentPlayer.drawCard();
		}
		this.currentPlayer.turnReset();
		this.nextTurn();
		this.turnIncrementSize = 1;
	}

	nextTurn() {
		if (this.direction === 'left') {
			this.currentTurn =
				(this.currentTurn + this.turnIncrementSize) % this._players.length;
		} else {
			this.currentTurn = this.currentTurn - this.turnIncrementSize;
			if (this.currentTurn < 0) {
				this.currentTurn = this._players.length - this.turnIncrementSize;
			}
		}

		const playersNotDone = this._players.filter(
			(player) => player.cards.length > 0
		);
		if (this.currentPlayer.cards.length === 0 && playersNotDone.length > 1) {
			this.nextTurn();
		} else if (playersNotDone.length <= 1) {
			// Only 1 player left, end game
			this.active = false;
		}
	}

	get nextPlayer() {
		this.nextTurn(); // Hacky method?? Goes to next player and save it, then go back to the last player
		const player = this.currentPlayer;
		this.direction = this.direction === 'left' ? 'right' : 'left';
		this.nextTurn();
		this.direction = this.direction === 'left' ? 'right' : 'left';

		return player;
	}

	get currentPlayer() {
		return this._players[this.currentTurn];
	}
}
