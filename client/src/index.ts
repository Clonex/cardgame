import 'regenerator-runtime/runtime';
import { Loader } from 'pixi.js';
import type PIXI from 'pixi.js';
import { getApp, setSize } from './get-app';
// import { GAME_WIDTH, GAME_HEIGHT } from './constants';
import State from "./State";

import {localStorageData} from "./classes/Player";
import WelcomePage from "./WelcomePage";
import GamePage from "./GamePage";

let app: PIXI.Application;
const loader = Loader.shared;

function startLoadingAssets(): void {
  loader.add('rabbit', './assets/test.png');
  loader.load();
}

window.onload = () => {
  app = getApp();
  startLoadingAssets();
  // await State.connection.onReady;
  loader.onComplete.once(() => {
    const gamePage = new GamePage();
    State.gameView = gamePage;

    const page = new WelcomePage();

    page.onStart = () => {
      State.connection.send({
        cmd: "startGame"
      });
      page.alpha = 0;
      page.interactive = false;

      app.stage.addChild(gamePage);
    };
    // setTimeout(page.onStart, 100);

    State.connection.onReady.then(() => {
      app.stage.addChild(page);

      if(window.location.hash.includes("/game/"))
      {
        const id = window.location.hash.split("/game/")[1];
        let lastPlayerID;
        let localData = localStorage.getItem("playerData");
        if(localData)
        {
          const lastPlayerData = JSON.parse(localData) as localStorageData;
          if(lastPlayerData.gameID === id)
          {
            lastPlayerID = lastPlayerData.playerID;
          }
        }

        State.connection.send({
          cmd: "joinGame",
          gameID: id,
          playerID: lastPlayerID,
        });
        page.alpha = 0;
        page.interactive = false;

        app.stage.addChild(gamePage);
      }

    });
    State.centerElems.push(page);
    setSize();
  });

  window.gameData = {
    State,
    app,
  };
};
