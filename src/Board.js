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
        backlog: clients,
        inProgress: [],
        complete: [],
      }
    }
    this.swimlanes = {
      backlog: React.createRef(),
      inProgress: React.createRef(),
      complete: React.createRef(),
    }
  }
  getClients() {
    return [
      ['1', 'Stark, White and Abbott', 'Cloned Optimal Architecture', 'backlog'],
      ['2', 'Wiza LLC', 'Exclusive Bandwidth-Monitored Implementation', 'backlog'],
      ['3', 'Nolan LLC', 'Vision-Oriented 4Thgeneration Graphicaluserinterface', 'backlog'],
      ['4', 'Thompson PLC', 'Streamlined Regional Knowledgeuser', 'backlog'],
      ['5', 'Walker-Williamson', 'Team-Oriented 6Thgeneration Matrix', 'backlog'],
      ['6', 'Boehm and Sons', 'Automated Systematic Paradigm', 'backlog'],
      ['7', 'Runolfsson, Hegmann and Block', 'Integrated Transitional Strategy', 'backlog'],
      ['8', 'Schumm-Labadie', 'Operative Heuristic Challenge', 'backlog'],
      ['9', 'Kohler Group', 'Re-Contextualized Multi-Tasking Attitude', 'backlog'],
      ['10', 'Romaguera Inc', 'Managed Foreground Toolset', 'backlog'],
      ['11', 'Reilly-King', 'Future-Proofed Interactive Toolset', 'backlog'],
      ['12', 'Emard, Champlin and Runolfsdottir', 'Devolved Needs-Based Capability', 'backlog'],
      ['13', 'Fritsch, Cronin and Wolff', 'Open-Source 3Rdgeneration Website', 'backlog'],
      ['14', 'Borer LLC', 'Profit-Focused Incremental Orchestration', 'backlog'],
      ['15', 'Emmerich-Ankunding', 'User-Centric Stable Extranet', 'backlog'],
      ['16', 'Willms-Abbott', 'Progressive Bandwidth-Monitored Access', 'backlog'],
      ['17', 'Brekke PLC', 'Intuitive User-Facing Customerloyalty', 'backlog'],
      ['18', 'Bins, Toy and Klocko', 'Integrated Assymetric Software', 'backlog'],
      ['19', 'Hodkiewicz-Hayes', 'Programmable Systematic Securedline', 'backlog'],
      ['20', 'Murphy, Lang and Ferry', 'Organized Explicit Access', 'backlog'],
    ].map(companyDetails => ({
      id: companyDetails[0],
      name: companyDetails[1],
      description: companyDetails[2],
      status: companyDetails[3],
    }));
  }
  renderSwimlane(name, clients, ref) {
    return (
      <Swimlane name={name} clients={clients} dragulaRef={ref} />
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
  componentDidMount() {
    const { backlog, inProgress, complete } = this.swimlanes;

    //Initializing Dragula with three swim lane drag containers
    this.drake = Dragula([
      backlog.current,
      inProgress.current,
      complete.current,
    ])

    this.drake.on('drop', (el, target, source) => {
      this.handleDrop(el, target, source);
    })
  }

  handleDrop(el, target, source, sibling) {
    // Capture position BEFORE cancel reverts the DOM
    const siblingId = sibling ? sibling.getAttribute('data-id') : null;

    // Revert Dragula's DOM move — let React re-render from state
    this.drake.cancel(true);

    const swimlaneMap = new Map([
      [this.swimlanes.backlog.current, { key: 'backlog', status: 'backlog' }],
      [this.swimlanes.inProgress.current, { key: 'inProgress', status: 'in-progress' }],
      [this.swimlanes.complete.current, { key: 'complete', status: 'complete' }],
    ]);

    const targetLane = swimlaneMap.get(target);
    const sourceLane = swimlaneMap.get(source);

    if (!targetLane || !sourceLane) return;

    const cardId = el.getAttribute('data-id');

    this.setState(prevState => {
      const card = prevState.clients[sourceLane.key].find(c => c.id === cardId);
      if (!card) return null;

      const updatedCard = { ...card, status: targetLane.status };

      // Remove card from source lane
      const updatedSource = prevState.clients[sourceLane.key].filter(c => c.id !== cardId);

      // Build target lane array (use updatedSource if same lane, else existing target)
      const baseTarget = sourceLane.key === targetLane.key
        ? updatedSource
        : [...prevState.clients[targetLane.key]];

      // Insert at correct position using sibling
      let updatedTarget;
      if (siblingId) {
        const siblingIndex = baseTarget.findIndex(c => c.id === siblingId);
        updatedTarget = siblingIndex !== -1
          ? [...baseTarget.slice(0, siblingIndex), updatedCard, ...baseTarget.slice(siblingIndex)]
          : [...baseTarget, updatedCard];
      } else {
        updatedTarget = [...baseTarget, updatedCard]; // dropped at end
      }

      return {
        clients: {
          ...prevState.clients,
          [sourceLane.key]: sourceLane.key === targetLane.key ? updatedTarget : updatedSource,
          [targetLane.key]: updatedTarget,
        }
      };
    });
  }


  componentWillUnmount() {
    if (this.drake) {
      this.drake.destroy();
    }
  }
}
