import React from 'react';
import Card from './Card';
import './Swimlane.css';
import { Droppable } from 'react-beautiful-dnd';

export default class Swimlane extends React.Component {
  render() {
    const cards = this.props.clients.map(client => {
      return (
        <Card
        key={client.id}
        id={client.id}
        name={client.name}
        description={client.description}
        status={client.status}
        onCardDrop={this.props.onCardDrop}
      />
      
      );
      
    });

    return (
      <div className="Swimlane-column">
        <div className="Swimlane-title">{this.props.name}</div>
        <div className="Swimlane-dragColumn">{cards}</div>
      </div>
    );
  }
}

