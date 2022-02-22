// import {useState, useEffect} from "react";
import React from "react";
import { Link, Route, Redirect } from "wouter";

import Game from "./Game";
import ConnectionHandler from './ConnectionHandler';

import './App.css';

export default class App extends React.Component {
  connection;
  state = {
    gameID: false,
    playerID: false,

    players: [],
    cardStack: [],
  };

  constructor()
  {
    super();
  }

  componentDidMount()
  {
    this.connection = new ConnectionHandler(this);
    this.connection.onReady = () => {
      if(window.location.pathname.includes("/game/"))
      {
        const gameID = window.location.pathname.split("/game/")[1];
        this.setState({gameID});
        this.connection.send({
          cmd: "joinGame",
          gameID,
        });

        this.connection.send({
            cmd: "getPlayers",
            id: gameID
        });
      }
    };
  }

  startGame()
  {
    
    this.connection.send({cmd: "startGame", size: 2});
  }
  
  render()
  {
    console.log(process.env);
    return (
      <div className="App" key={this.state.gameID}>
        <div className="logo">LOGO</div>
        {/* {
          !this.state.gameID ? 
            <button>Join game</button> : 
            <Game id={this.state.gameID} players={this.state.players} connection={this.connection} />
        }  */}

          <Route path="/game/:gameID">
            {(params) => <Game id={params.gameID} players={this.state.players} cardStack={this.state.cardStack} connection={this.connection} />}                     
          </Route>

          
          <Route path="/">
            <button onClick={() => this.startGame()}>Start game</button> 
            {
              this.state.gameID && <Redirect to={"/game/" + this.state.gameID} />
            }
          </Route>
      </div>
    );
  }
}
// let connection;
// function App() {
//   // const [gameID, setGameID] = useState(false);

//   useEffect(() => {
//     connection = new ConnectionHandler();
//   }, []);
  
//   return (
//     <div className="App" key={this.state.gameID}>
//       {
//         !connection?.gameID ? <button>Join game</button> : <Game id={connection.gameID} connection={connection} />
//       }
//     </div>
//   );
// }

// export default App;
