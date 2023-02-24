import {assert, expect} from "chai";

import Game from "../src/Game";
import Card, {Types, Colors} from "../src/Card";

// console.log(_chai);
describe("A game", () => {
	let game;
	beforeEach(() => {
		game = new Game(4, 6);
		for(let i = 0; i < 3; i++) // Populate game with players
		{
			game.addPlayer();
		}
	});

	it("Playing card moves to next player", () => {
		const player = game.currentPlayer;
		const tempCard = new Card(Types.ONE, Colors.red, player);
		player.cards.push(tempCard);

		const lastTurn = game.currentTurn;
		game.play(player.id, tempCard.id, "none");
		game.endTurn();
        
		expect(game.currentTurn).to.equal(lastTurn + 1);
	});

	it("Playing reverse card reverses direction", () => {
		const player = game.currentPlayer;
		const nextPlayer = game.nextPlayer;
		const tempCard = new Card(Types.reverse, Colors.red, player);
		player.cards.push(tempCard);

		const lastDirection = game.direction;
		game.play(player.id, tempCard.id, "none");
		game.endTurn();
        
		expect(lastDirection).to.not.equal(game.direction);
		expect(nextPlayer).to.not.equal(game.nextPlayer);
	});

	it("Cant play card it dosent own", () => {
		const player = game.currentPlayer;
		const nextPlayer = game.nextPlayer;
		const lastTurn = game.currentTurn;

		game.play(player.id, nextPlayer.cards[0].id, "none");
        
		expect(lastTurn).to.equal(game.currentTurn);
	});

	it("Skip card skips the next players turn", () => {
		const player = game.currentPlayer;
		const nextPlayer = game.nextPlayer;
		const lastTurn = game.currentTurn;
		const tempCard = new Card(Types.skip, Colors.red, player);
		player.cards.push(tempCard);

		game.play(player.id, tempCard.id, "none");
		game.endTurn();

		expect(lastTurn).to.not.equal(game.currentTurn);
		expect(nextPlayer).to.not.equal(game.currentPlayer);
	});
    
	it("Cant play card that dosent match last color", () => {
		const player = game.currentPlayer;

		const tempCard = new Card(Types.ONE, Colors.red, player);
		player.cards.push(tempCard);

		const tempCardOther = new Card(Types.ONE, Colors.blue, player);
		game.nextPlayer.cards.push(tempCard);

		game.play(player.id, tempCard.id, "none");

		const lastTurn = game.currentTurn;
		game.play(player.id, tempCardOther.id, "none");
        
		expect(lastTurn).to.equal(game.currentTurn);
	});
    
	it("+2 works correctly", () => {
		const player = game.currentPlayer;
		const nextPlayer = game.nextPlayer;

		// Play +2 card
		const targetCard = nextPlayer.cards.find(card => card.type !== Types.PLUS1 && card.type !== Types.wild && card.type !== Types.PLUS4);
		const tempCard = new Card(Types.PLUS1, targetCard.color, player);
		player.cards.push(tempCard);
		game.play(player.id, tempCard.id, "none");
		game.endTurn();

		// Next player plays a non + card
		const handSize = nextPlayer.cards.length;
		game.play(nextPlayer.id, targetCard.id, "none");

		expect(handSize).to.equal(nextPlayer.cards.length);
	});
    
	it("+4 works correctly", () => {
		const player = game.currentPlayer;
		const nextPlayer = game.nextPlayer;

		// Play +4 card
		const targetCard = nextPlayer.cards.find(card => card.type !== Types.PLUS1 && card.type !== Types.wild && card.type !== Types.PLUS4);
		const tempCard = new Card(Types.PLUS4, targetCard.color, player);
		player.cards.push(tempCard);
		game.play(player.id, tempCard.id, targetCard.color);
		game.endTurn();

		// Next player plays a non + card
		const handSize = nextPlayer.cards.length;
		game.play(nextPlayer.id, targetCard.id, "none");

		expect(nextPlayer.cards.length - handSize).to.equal(3);
	});
    
	it("Wild works correctly", () => {
		const player = game.currentPlayer;
		const nextPlayer = game.nextPlayer;

		// Play wild card
		const targetCard = nextPlayer.cards.find(card => card.type !== Types.PLUS1 && card.type !== Types.wild && card.type !== Types.PLUS4);
		const tempCard = new Card(Types.wild, targetCard.color, player);
		player.cards.push(tempCard);
		game.play(player.id, tempCard.id, targetCard.color);
		game.endTurn();

		// Next player plays a non + card
		const handSize = nextPlayer.cards.length;
		game.play(nextPlayer.id, targetCard.id, "none");

		expect(handSize - nextPlayer.cards.length).to.equal(1);
	});
    
	it("Normal cards dont stack after wild cards", () => {
		const player = game.currentPlayer;
		const targetCard = player.cards.find(card => card.color != Colors.none);

		const tempCard = new Card(Types.wild, Colors.none, player);
		player.cards.push(tempCard);
		game.play(player.id, tempCard.id, targetCard.color);

		const handSize = player.cards.length;
		game.play(player.id, targetCard.id, "none");

		expect(handSize).to.equal(player.cards.length);
	});
    
	it("inactive() and active() works correctly", () => {
		const player = game.currentPlayer;
		player.inactive();

		expect(game._inactivePlayers.length).to.equal(1);
		player.activate();

		expect(game._inactivePlayers.length).to.equal(0);

		game.endTurn();
		player.inactive();
		expect(game.currentTurn).to.equal(1);
	});
    
	it("Cant play multiple different of same color", () => {
		const player = game.currentPlayer;
		const tempCard = new Card(Types.ONE, Colors.red, player);
		player.cards.push(tempCard);

		const tempCardTWO = new Card(Types.TWO, Colors.red, player);
		player.cards.push(tempCardTWO);
        
		const handSize = player.cards.length;
		game.play(player.id, tempCard.id, "none");
		game.play(player.id, tempCardTWO.id, "none");
        
		expect(handSize - player.cards.length).to.equal(1);
	});
    
	it("Can stack another players +2", () => {
		const player = game.currentPlayer;
		const nextPlayer = game.nextPlayer;
		const tempCard = new Card(Types.PLUS1, Colors.red, player);
		player.cards.push(tempCard);

		const tempCardTWO = new Card(Types.PLUS1, Colors.red, nextPlayer);
		nextPlayer.cards.push(tempCardTWO);
		const tempCardFour = new Card(Types.PLUS4, Colors.red, nextPlayer);
		nextPlayer.cards.push(tempCardTWO);
        
		game.play(player.id, tempCard.id, "none");
		game.endTurn();

		game.play(nextPlayer.id, tempCardTWO.id, "none");
		game.play(nextPlayer.id, tempCardFour.id, Colors.blue);
        
		expect(game.drawBuffer).to.equal(2);
	});
    
	it("Player must draw if they cant play anything", () => {
		const player = game.currentPlayer;
		const handSize = player.cards.length;
		game.endTurn();
        
		expect(player.cards.length - handSize).to.equal(1);
	});
    
	it("Player will get 2 extra cards if they forget to call last card", () => {
		const player = game.currentPlayer;
		player.cards = [];
        
		const tempCard = new Card(Types.ONE, Colors.red, player);
		player.cards.push(tempCard);
		const tempCardExtra = new Card(Types.ONE, Colors.red, player);
		player.cards.push(tempCardExtra);

		game.play(player.id, tempCard.id);
        
		expect(player.cards.length).to.equal(3);
	});
    
	it("Player can play second last card when calling last card", () => {
		const player = game.currentPlayer;
		player.cards = [];
        
		const tempCard = new Card(Types.ONE, Colors.red, player);
		player.cards.push(tempCard);
		const tempCardExtra = new Card(Types.ONE, Colors.red, player);
		player.cards.push(tempCardExtra);

		player.calledLast(true);
		game.play(player.id, tempCard.id);
        
		expect(player.cards.length).to.equal(1);
	});
});