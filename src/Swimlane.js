import React from 'react';
import Card from './Card';
import './Swimlane.css';

export default class Swimlane extends React.Component {
  handleDragEnter = (e) => {
    e.target.classList.add('Card-drag-enter');
  };

  handleDragLeave = (e) => {
    e.target.classList.remove('Card-drag-enter');
  };

  handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.target.classList.remove('Card-drag-enter');
    const cardId = e.dataTransfer.getData('cardId');
    const swimlaneId = e.target.dataset.swimlane;
    this.props.changeCardSwimlane(cardId, swimlaneId);
  };

  renderCards() {
    return this.props.clients.map((client) => (
      <Card
        key={client.id}
        id={client.id}
        name={client.name}
        description={client.description}
        status={client.status}
      />
    ));
  }

  render() {
    return (
      <div
        className="Swimlane-column"
        onDragEnter={this.handleDragEnter}
        onDragLeave={this.handleDragLeave}
        onDragOver={(e) => e.preventDefault()}
        onDrop={this.handleDrop}
        data-swimlane={this.props.name}
        ref={this.props.dragulaRef}
      >
        <div className="Swimlane-title">{this.props.name}</div>
        <div className="Swimlane-dragColumn">{this.renderCards()}</div>
      </div>
    );
  }
}

