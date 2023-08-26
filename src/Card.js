import React, { Component } from 'react';
import './Card.css';

export default class Card extends Component {
  handleDragStart = event => {
    event.dataTransfer.setData('text/plain', this.props.id);
    event.dataTransfer.setData('status', this.props.status);
  };

  handleDragOver = event => {
    event.preventDefault();
  };

  handleDrop = event => {
    event.preventDefault();
    const clientID = event.dataTransfer.getData('text/plain');
    const newStatus = this.props.status;
    this.props.onCardDrop(clientID, newStatus);
  };

  render() {
    let className = ['Card'];
    if (this.props.status === 'backlog') {
      className.push('Card-grey');
    } else if (this.props.status === 'in-progress') {
      className.push('Card-blue');
    } else if (this.props.status === 'complete') {
      className.push('Card-green');
    }
    return (
      <div
        className={className.join(' ')}
        data-id={this.props.id}
        data-status={this.props.status}
        draggable
        onDragStart={this.handleDragStart}
        onDragOver={this.handleDragOver}
        onDrop={this.handleDrop}
      >
        <div className="Card-title">{this.props.name}</div>
      </div>
    );
  }
}
