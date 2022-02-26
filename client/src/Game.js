import React from "react";
import ReactDOM from "react-dom";

import Player from "./Player";
import Card from "./Card";

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
                pos.left += window.innerWidth / 2;
            }

            const posTarget = this.cardStack.getBoundingClientRect();
            const container = document.createElement("div");
            container.className = "cardStack";

            ReactDOM.render(<Card color={color} type={type} />, container);
            
            container.style.position = "absolute";
            container.style.left = pos.left + "px";
            container.style.top = pos.top + "px";
            container.style.top = pos.top + "px";
            document.body.appendChild(container);

            const anim = container.animate([
                { transform: 'translateY(0px) translateX(0px)' },
                { transform: `translateY(${posTarget.top - pos.top}px) translateX(${(posTarget.left - pos.left) + 50}px)` }
              ], {
                duration: 200,
            });

            anim.onfinish = () => document.body.removeChild(container);
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
                    this.props.cardStack.map((card, i) => <Card {...card} key={i} />)
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