// import {useState, useEffect} from "react";
import React from "react";
import { Route, Redirect, Router } from "wouter";

import Game from "./Game";
import ConnectionHandler from './ConnectionHandler';

import {SERVER_IP, hashRouter} from "./utils";

import './App.css';

export default class App extends React.Component {
  gameInstance = React.createRef();
  connection;
  state = {
    gameID: false,
    playerID: false,

    players: [],
    cardStack: [],
    currentTurn: false,
  };

  constructor()
  {
    super();
  }

  componentDidMount()
  {
    this.connection = new ConnectionHandler(this);
    this.connection.onReady = () => {
      if(window.location.hash.includes("/game/"))
      {
        const gameID = window.location.hash.split("/game/")[1];
        this.setState({gameID});
        this.connection.send({
          cmd: "joinGame",
          gameID,
        });
      }
    };
  }

  animateCard(color, type, playerID)
  {
    this.gameInstance.current?.animateCard(color, type, playerID);
  }

  startGame()
  {
    this.connection.send({cmd: "startGame", size: 0});
  }
  
  render()
  {
    console.log(process.env, SERVER_IP);
    
    return (
      <div className="App" key={this.state.gameID}>
        <div className="logo">LOGO</div>

          <Router hook={hashRouter}>
            <Route path={process.env.PUBLIC_URL + "/game/:gameID"}>
              {(params) => <Game
                id={params.gameID}
                ref={this.gameInstance}
                players={this.state.players}
                currentTurn={this.state.currentTurn}
                cardStack={this.state.cardStack}
                connection={this.connection}
              />}                     
            </Route>

            
            <Route>
              <button onClick={() => this.startGame()}>Start game</button> 
              {
                this.state.gameID && <Redirect to={process.env.PUBLIC_URL + "/game/" + this.state.gameID} />
              }
            </Route>
          </Router>

      </div>
    );
  }
}