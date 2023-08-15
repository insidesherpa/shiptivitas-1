import React from 'react';
import Card from './Card';
import './Swimlane.css';
import dragula from 'dragula';

export default class Swimlane extends React.Component {

  constructor(props) {
    super(props);
    this.swimlaneRef = React.createRef();
  }

  componentDidMount() {
    this.initializeDragula();
  }

  initializeDragula() {
    const drake = dragula([this.swimlaneRef.current]);
    drake.on('drop', (el, target, source) => {
      const swimlane = target.getAttribute('data-swimlane'); // Corrected attribute name
      el.style.backgroundColor = this.getTaskColor(swimlane);
    });
  }

  getTaskColor(swimlane) {
    switch (swimlane) {
      case 'backlog':
        return 'grey';
      case 'inProgress':
        return 'blue';
      case 'complete':
        return 'green';
      default:
        return 'grey'; // Default to grey color for unknown swimlanes
    }
  }

  render() {
    const cards = this.props.clients.map(client => (
      <Card
        key={client.id}
        id={client.id}
        name={client.name}
        description={client.description}
        status={client.status}
      />
    ));

    return (
      <div className="Swimlane-column" data-swimlane={this.props.name} ref={this.swimlaneRef}>
        <div className="Swimlane-title">{this.props.name}</div>
        <div className="Swimlane-dragColumn">
          {cards}
        </div>
      </div>
    );
  }
}
