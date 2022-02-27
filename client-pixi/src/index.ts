import { Loader } from 'pixi.js';
import type PIXI from 'pixi.js';
import { getApp, setSize } from './get-app';
// import { GAME_WIDTH, GAME_HEIGHT } from './constants';
import State from "./State";

import WelcomePage from "./WelcomePage";
import GamePage from "./GamePage";

let app: PIXI.Application;
const loader = Loader.shared;

function startLoadingAssets(): void {
  loader.add('rabbit', './assets/rabbit.png');
  loader.load();
}

window.onload = () => {
  app = getApp();
  startLoadingAssets();
  loader.onComplete.once(() => {
    const page = new WelcomePage();

    page.onStart = () => {
      page.alpha = 0;
      page.interactive = false;

      const gamePage = new GamePage();
      State.gameView = gamePage;
      app.stage.addChild(gamePage);
    };

    setTimeout(page.onStart, 100);

    app.stage.addChild(page);
    State.centerElems.push(page);
    setSize();
  });

  window.gameData = {
    State,
    app,
  };
};
