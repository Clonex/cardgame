import { SERVER_IP } from './utils';
import State from './State';

export default class ConnectionHandler {
	ws?: WebSocket;
	#connectionPromises: ((value: boolean) => void)[] = [];
	pingInterval?: NodeJS.Timeout;

	constructor() {
		this.openConnection();
	}

	openConnection() {
		this.ws = new WebSocket(SERVER_IP);
		this.ws.onopen = () => this.#onReady();
		this.ws.onclose = () =>
			setTimeout(() => {
				// this.#connectionPromises.push(() => {
				//     State.gameView.joinGame();
				// });
				// this.openConnection();
				location.reload();
			}, 200);
		this.ws.onmessage = (data: any) => this.#data(data);
	}

	#onReady() {
		this.#connectionPromises.forEach((resolve) => resolve(true));
		this.send({ cmd: 'ping' });

		if (this.pingInterval) {
			clearInterval(this.pingInterval);
		}
		this.pingInterval = setInterval(
			() => this.send({ cmd: 'ping' }),
			1000 * 60 * 2
		);
	}

	#data(d: { cmd: string; data: string }) {
		const data = JSON.parse(d.data);
		const game = State.gameView;
		console.log('Got something', data);

		switch (data.cmd) {
			case 'startGame':
				window.location.hash = `/game/${data.id}`;
				this.send({
					cmd: 'joinGame',
					gameID: data.id,
				});
				game.id = data.id;
				break;
			case 'joinGame':
				if (!data.id) {
					window.location.assign('/');
				} else {
					console.log('huh', game);
					game.hand.id = data.id;
					game.id = data.gameID;
					localStorage.setItem(
						'playerData',
						JSON.stringify({
							gameID: data.gameID,
							playerID: data.id,
						})
					);
					this.send({
						cmd: 'getCards',
					});
				}
				break;
			case 'getCards':
				for (let i = 0; i < data.players.length; i++) {
					const player = data.players[i];
					if (player.id === game.hand.id) {
						game.hand.setCards(player.cards);
					} else {
						game.setCards(player.id, player.cards);
					}
				}
				game.setTurn(data.currentTurn);
				game.updatePosition();
				break;
			case 'cardStack':
				game.cardStack.setCards(data.stack);
				break;
			case 'cursor':
				game.cursorScreen.cursorTick(data.player, data.x, data.y);
				break;
			case 'playFailed':
				{
					const card = game.hand.getCardElem(data.cardID);
					card?.moveToHand();
				}
				break;
		}
	}

	get onReady() {
		return new Promise<boolean>((r) => {
			if (this.ws?.readyState === 1) {
				r(true);
			} else if ((this.ws?.readyState ?? 0) > 1) {
				r(false);
			} else {
				this.#connectionPromises.push(r);
			}
		});
	}

	send(data: { [key: string]: string | number | undefined }): void {
		this.ws?.send(JSON.stringify(data));
	}
}
