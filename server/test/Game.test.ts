import {assert, expect} from 'chai';

import Game from "../src/Game";
import Card from "../src/Card";

// console.log(_chai);
describe('Test Suite 1', () => {
    const game = new Game(4, 6);

    it('Playing card moves to next player', () => {
        const player = game.currentPlayer;
        const tempCard = new Card("1", player);
        player.cards.push(tempCard);

        const lastTurn = game.currentTurn;
        game.play(player.id, tempCard.id);
        
        expect(game.currentTurn).to.equal(lastTurn + 1);
    });

    it('Playing reverse card reverses direction', () => {
        const player = game.currentPlayer;
        const tempCard = new Card("reverse", player);
        player.cards.push(tempCard);

        const lastDirection = game.direction;
        game.play(player.id, tempCard.id);
        
        expect(lastDirection).to.not.equal(game.direction);
    });

    it('Cant play card it dosent own', () => {
        const player = game.currentPlayer;
        const nextPlayer = game.nextPlayer;
        const lastTurn = game.currentTurn;

        game.play(player.id, nextPlayer.cards[0].id);
        
        expect(lastTurn).to.equal(game.currentTurn);
    });
    
    // it('Cant play card that dosent match last color', () => {
    //     const player = game.currentPlayer;
    //     const nextPlayer = game.nextPlayer;
    //     const lastTurn = game.currentTurn;

    //     game.play(player.id, nextPlayer.cards[0].id);
        
    //     expect(lastTurn).to.equal(game.currentTurn);
    // });
});