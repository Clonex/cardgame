import React from "react";

import Player from "./Player";
import {getImage, PICKER_TYPES} from "./utils";

export default class Game extends React.Component {
    players = {};
    cardStack;

    animateCard(color, type, playerID)
    {
        const me = this.props.players.find(player => player.cards?.[0].color);
        const player = this.players[playerID];
        if(player)
        {
            const pos = {...player.getBoundingClientRect().toJSON()};
            if(me.id === playerID)
            {
                console.log("Adjust pos", pos.left);
                pos.left += window.innerWidth / 2;
                console.log("Adjusted pos", pos.left);
            }

            const posTarget = this.cardStack.getBoundingClientRect();
            const container = document.createElement("div");
            container.className = "cardStack";

            const temp = document.createElement("img");
            temp.src = getImage(color, type);
            container.appendChild(temp);
            
            container.style.position = "absolute";
            container.style.left = pos.left + "px";
            container.style.top = pos.top + "px";
            container.style.top = pos.top + "px";
            document.body.appendChild(container);

            container.animate([
                { transform: 'translateY(0px) translateX(0px)' },
                { transform: `translateY(${posTarget.top - pos.top}px) translateX(${(posTarget.left - pos.left) + 50}px)` }
              ], {
                duration: 200,
            });
            setTimeout(() => {
                container.outerHTML = "";
            }, 200);
        }
    }

    render()
    {
        if(this.props.players.length === 0)
        {
            return <div/>;
        }
        const me = this.props.players.find(player => player.cards?.[0].color);
        return (<div>
            <div className="players" style={{"--players": this.props.players.length - 1}} key={this.props.players.length}>
            {
                this.props.players.map((player, i) => player.id !== me.id && <Player
                    cards={player.cards}
                    id={player.id}
                    ref={e => this.players[player.id] = e}
                    i={i}
                    highlight={player.id === this.props.currentTurn}
                    totalPlayers={this.props.players.length}
                    connection={this.props.connection}
                    key={player.id}
                />)
            }
            </div>
            <div className="myPlayer">
                <Player
                    cards={me.cards}
                    id={me.id}
                    ref={e => this.players[me.id] = e}
                    highlight={me.id === this.props.currentTurn}
                    i={0}
                    totalPlayers={this.props.players.length}
                    connection={this.props.connection}
                />
            </div>

            <div className="cardStack" ref={e => this.cardStack = e}>
                {
                    this.props.cardStack.map((card, i) => {
                        let bgColor = PICKER_TYPES.includes(card.type) ? "#FFF" : false;
                        return (<img src={getImage(card.color, card.type)} key={card.id} />);
                    })
                }
            </div>

            {
                me.id === this.props.currentTurn && <div className="settings">
                    <button onClick={() => this.props.connection.send({cmd: "drawCard"})}>
                        Draw card
                    </button>

                    <button onClick={() => this.props.connection.send({cmd: "endTurn"})}>
                        End turn
                    </button>
                </div>
            }
        </div>);
    }
}