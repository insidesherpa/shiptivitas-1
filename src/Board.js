import React from 'react';
import Dragula from 'dragula';
import 'dragula/dist/dragula.css';
import Swimlane from './Swimlane';
import './Board.css';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    const clients = this.getClients();
    this.state = {
  clients: {
    backlog: clients.map(client => ({
      ...client,
      status: 'backlog',
    })),
    inProgress: [],
    complete: [],
  },
};
    this.swimlanes = {
      backlog: React.createRef(),
      inProgress: React.createRef(),
      complete: React.createRef(),
    }
  }
componentDidMount() {
  const containers = [
    this.swimlanes.backlog.current,
    this.swimlanes.inProgress.current,
    this.swimlanes.complete.current,
  ].filter(Boolean);

  this.dragula = Dragula(containers, {
    moves: el => el.classList.contains('Card'),
    accepts: (el,target) =>
      target.classList.contains('Swimlane-dragColumn'),
  });

  // Remember where the card originally belongs in the DOM.
  this.dragula.on('drag', el => {
    this.dragOrigin = {
      parent: el.parentNode,
      nextSibling: el.nextSibling,
    };
  });

  this.dragula.on('drop', this.handleDrop);
}
handleDrop = (el, target, source) => {
  if (!target || !source) return;

  const allClients = [
    ...this.state.clients.backlog,
    ...this.state.clients.inProgress,
    ...this.state.clients.complete,
  ];

  const clientsById = new Map(
    allClients.map(client => [String(client.id), client])
  );

  const nextClients = {
    backlog: [],
    inProgress: [],
    complete: [],
  };

  const laneRefs = {
    backlog: this.swimlanes.backlog,
    'in-progress': this.swimlanes.inProgress,
    complete: this.swimlanes.complete,
  };

  // Read the new order and statuses before restoring the DOM.
  Object.entries(laneRefs).forEach(([status, ref]) => {
    const container = ref.current;
    if (!container) return;

    const stateKey =
      status === 'in-progress' ? 'inProgress' : status;

    Array.from(container.children).forEach(cardElement => {
      const client = clientsById.get(cardElement.dataset.id);
      if (!client) return;

      nextClients[stateKey].push({
        ...client,
        status,
      });
    });
  });

  // Restore the DOM to its original React-managed position.
  // React can then apply the new order without conflicting
  // with Dragula's direct DOM manipulation.
  const origin = this.dragOrigin;

  if (origin && origin.parent) {
    if (
      origin.nextSibling &&
      origin.nextSibling.parentNode === origin.parent
    ) {
      origin.parent.insertBefore(el, origin.nextSibling);
    } else {
      origin.parent.appendChild(el);
    }
  }

  this.dragOrigin = null;

  // React now applies the new lane membership and card order.
  this.setState({
    clients: nextClients,
  });
};
componentWillUnmount() {
  if (this.dragula) {
    this.dragula.destroy();
  }
}
  getClients() {
    return [
      ['1','Stark, White and Abbott','Cloned Optimal Architecture', 'in-progress'],
      ['2','Wiza LLC','Exclusive Bandwidth-Monitored Implementation', 'complete'],
      ['3','Nolan LLC','Vision-Oriented 4Thgeneration Graphicaluserinterface', 'backlog'],
      ['4','Thompson PLC','Streamlined Regional Knowledgeuser', 'in-progress'],
      ['5','Walker-Williamson','Team-Oriented 6Thgeneration Matrix', 'in-progress'],
      ['6','Boehm and Sons','Automated Systematic Paradigm', 'backlog'],
      ['7','Runolfsson, Hegmann and Block','Integrated Transitional Strategy', 'backlog'],
      ['8','Schumm-Labadie','Operative Heuristic Challenge', 'backlog'],
      ['9','Kohler Group','Re-Contextualized Multi-Tasking Attitude', 'backlog'],
      ['10','Romaguera Inc','Managed Foreground Toolset', 'backlog'],
      ['11','Reilly-King','Future-Proofed Interactive Toolset', 'complete'],
      ['12','Emard, Champlin and Runolfsdottir','Devolved Needs-Based Capability', 'backlog'],
      ['13','Fritsch, Cronin and Wolff','Open-Source 3Rdgeneration Website', 'complete'],
      ['14','Borer LLC','Profit-Focused Incremental Orchestration', 'backlog'],
      ['15','Emmerich-Ankunding','User-Centric Stable Extranet', 'in-progress'],
      ['16','Willms-Abbott','Progressive Bandwidth-Monitored Access', 'in-progress'],
      ['17','Brekke PLC','Intuitive User-Facing Customerloyalty', 'complete'],
      ['18','Bins, Toy and Klocko','Integrated Assymetric Software', 'backlog'],
      ['19','Hodkiewicz-Hayes','Programmable Systematic Securedline', 'backlog'],
      ['20','Murphy, Lang and Ferry','Organized Explicit Access', 'backlog'],
    ].map(companyDetails => ({
      id: companyDetails[0],
      name: companyDetails[1],
      description: companyDetails[2],
      status: companyDetails[3],
    }));
  }
  renderSwimlane(name, clients, ref) {
    return (
      <Swimlane name={name} clients={clients} dragulaRef={ref}/>
    );
  }

  render() {
    return (
      <div className="Board">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              {this.renderSwimlane('Backlog', this.state.clients.backlog, this.swimlanes.backlog)}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('In Progress', this.state.clients.inProgress, this.swimlanes.inProgress)}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('Complete', this.state.clients.complete, this.swimlanes.complete)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
