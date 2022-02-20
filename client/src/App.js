// import {useState, useEffect} from "react";
import React from "react";
import logo from './logo.svg';
import './App.css';

import Game from "./Game";
import ConnectionHandler from './ConnectionHandler';

export default class App extends React.Component {
  connection;
  state = {
    gameID: false,
    playerID: false,

    players: [],
  };

  constructor()
  {
    super();
  }

  componentDidMount()
  {
    this.connection = new ConnectionHandler(this);
  }
  
  render()
  {
    return (
      <div className="App" key={this.state.gameID}>
        {
          !this.state.gameID ? 
            <button>Join game</button> : 
            <Game id={this.state.gameID} players={this.state.players} connection={this.connection} />
        } 
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
