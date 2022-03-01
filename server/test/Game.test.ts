import {assert, expect} from 'chai';

import Game from "../src/Game";
import Card, {Types, Colors} from "../src/Card";

// console.log(_chai);
describe('Test Suite 1', () => {
    const game = new Game(4, 6);

    it('Playing card moves to next player', () => {
        const player = game.currentPlayer;
        const tempCard = new Card(Types.ONE, Colors.red, player);
        player.cards.push(tempCard);

        const lastTurn = game.currentTurn;
        game.play(player.id, tempCard.id, "none");
        game.nextTurn();
        
        expect(game.currentTurn).to.equal(lastTurn + 1);
    });

    it('Playing reverse card reverses direction', () => {
        const player = game.currentPlayer;
        const tempCard = new Card(Types.reverse, Colors.red, player);
        player.cards.push(tempCard);

        const lastDirection = game.direction;
        game.play(player.id, tempCard.id, "none");
        
        expect(lastDirection).to.not.equal(game.direction);
    });

    it('Cant play card it dosent own', () => {
        const player = game.currentPlayer;
        const nextPlayer = game.nextPlayer;
        const lastTurn = game.currentTurn;

        game.play(player.id, nextPlayer.cards[0].id, "none");
        
        expect(lastTurn).to.equal(game.currentTurn);
    });

    it('Skip card skips the next players turn', () => {
        const player = game.currentPlayer;
        const nextPlayer = game.nextPlayer;
        const lastTurn = game.currentTurn;
        const tempCard = new Card(Types.skip, Colors.red, player);
        player.cards.push(tempCard);

        game.play(player.id, tempCard.id, "none");
        
        expect(lastTurn).to.not.equal(game.currentTurn);
        expect(nextPlayer).to.not.equal(game.currentPlayer);
    });
    
    it('Cant play card that dosent match last color', () => {
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
});