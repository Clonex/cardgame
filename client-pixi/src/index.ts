import { Loader } from 'pixi.js';
import type PIXI from 'pixi.js';
import { getApp, setSize } from './get-app';
// import { GAME_WIDTH, GAME_HEIGHT } from './constants';
import State from "./State";

import WelcomePage from "./WelcomePage";

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
    State.centerElems.push(page);

    app.stage.addChild(page);
    setSize();
  });
};
