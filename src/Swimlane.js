import React, { useEffect, useState } from 'react';
import Card from './Card';
import './Swimlane.css';

const Swimlane = ({ name, clients, dragulaRef }) => {

  const [data, setData] = useState('');

  // Function to set the data-status of swimlane
  const getName = (name) => {
    switch (name) {
      case 'Backlog':
        return "backlog"
      case 'In Progress':
        return "in-progress"
      case 'Complete':
        return "complete"
      default:
        return '';
    }
  };

  useEffect(() => {
    setData(getName(name));
  }, [dragulaRef])


  const cards = clients.map(client => (
    <Card
      key={client.id}
      id={client.id}
      name={client.name}
      description={client.description}
      status={data}
    />
  ));



  return (
    <div className="Swimlane-column">
      <div className="Swimlane-title">{name}</div>
      <div className="Swimlane-dragColumn" ref={dragulaRef} data-status={data}>
        {cards}
      </div>
    </div>
  );
};

export default Swimlane;

