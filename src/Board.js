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
        backlog: clients.filter(client => !client.status || client.status === 'backlog'),
        inProgress: clients.filter(client => client.status && client.status === 'in-progress'),
        complete: clients.filter(client => client.status && client.status === 'complete'),
      }
    }
    this.swimlanes = {
      backlog: React.createRef(),
      inProgress: React.createRef(),
      complete: React.createRef(),
    }
     this.originalPosition = {
      parent: null,
      nextSibling: null,
    };
  }

   

  componentDidMount() {
  const drake = Dragula([
    this.swimlanes.backlog.current,
    this.swimlanes.inProgress.current,
    this.swimlanes.complete.current,
  ]);

  drake.on('drag', element => {
    this.originalPosition = {
      parent: element.parentNode,
      nextSibling: element.nextSibling,
    };
  });

  drake.on('drop', (element, target, source, sibling) => {
    const { parent, nextSibling } = this.originalPosition;

    if (nextSibling && nextSibling.parentNode === parent) {
      parent.insertBefore(element, nextSibling);
    } else {
      parent.appendChild(element);
    }

    this.handleDrop(element, target, source, sibling);
  });

  this.drake = drake;
}
  handleDrop(element, target, source, sibling) {
  const clientId = element.dataset.id;
  const sourceStatus = source.dataset.status;
  const targetStatus = target.dataset.status;
  const siblingId = sibling ? sibling.dataset.id : null;

  this.setState(prevState => {
    const clients = {
      backlog: [...prevState.clients.backlog],
      inProgress: [...prevState.clients.inProgress],
      complete: [...prevState.clients.complete],
    };

    const sourceLane =
      sourceStatus === 'backlog'
        ? 'backlog'
        : sourceStatus === 'in-progress'
          ? 'inProgress'
          : 'complete';

    const targetLane =
      targetStatus === 'backlog'
        ? 'backlog'
        : targetStatus === 'in-progress'
          ? 'inProgress'
          : 'complete';

    const clientIndex = clients[sourceLane].findIndex(
      client => client.id === clientId
    );

    if (clientIndex === -1) {
      return null;
    }

    const [movedClient] = clients[sourceLane].splice(clientIndex, 1);

const updatedClient = {
  ...movedClient,
  status: targetStatus,
};

    let insertIndex;

    if (siblingId) {
      insertIndex = clients[targetLane].findIndex(
        client => client.id === siblingId
      );
    } else {
      insertIndex = clients[targetLane].length;
    }

    if (insertIndex === -1) {
      insertIndex = clients[targetLane].length;
    }

    clients[targetLane].splice(insertIndex, 0, updatedClient);

    return {
      clients,
    };
  });
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
  renderSwimlane(name, status, clients, ref) {
  return (
    <Swimlane
      name={name}
      status={status}
      clients={clients}
      dragulaRef={ref}
    />
  );
}
  render() {
    return (
      <div className="Board">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              {this.renderSwimlane(
                'Backlog',
                'backlog',
                this.state.clients.backlog,
                this.swimlanes.backlog
              )}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane(
                'In Progress',
                'in-progress',
                this.state.clients.inProgress,
                this.swimlanes.inProgress
              )}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane(
                'Complete',
                'complete',
                this.state.clients.complete,
                this.swimlanes.complete
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
