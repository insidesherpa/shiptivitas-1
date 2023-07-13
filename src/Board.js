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
        backlog: clients.filter(
          (client) => !client.status || client.status === 'backlog'
        ),
        inProgress: clients.filter(
          (client) => client.status && client.status === 'in-progress'
        ),
        complete: clients.filter(
          (client) => client.status && client.status === 'complete'
        ),
      },
    };
    this.swimlanes = {
      backlog: React.createRef(),
      inProgress: React.createRef(),
      complete: React.createRef(),
    };
  }
  getClients() {
    return [
      ['1', 'Stark, White and Abbott', 'Cloned Optimal Architecture'],
      ['2', 'Wiza LLC', 'Exclusive Bandwidth-Monitored Implementation'],
      [
        '3',
        'Nolan LLC',
        'Vision-Oriented 4Thgeneration Graphicaluserinterface',
      ],
      ['4', 'Thompson PLC', 'Streamlined Regional Knowledgeuser'],
      ['5', 'Walker-Williamson', 'Team-Oriented 6Thgeneration Matrix'],
      ['6', 'Boehm and Sons', 'Automated Systematic Paradigm'],
      [
        '7',
        'Runolfsson, Hegmann and Block',
        'Integrated Transitional Strategy',
      ],
      ['8', 'Schumm-Labadie', 'Operative Heuristic Challenge'],
      ['9', 'Kohler Group', 'Re-Contextualized Multi-Tasking Attitude'],
      ['10', 'Romaguera Inc', 'Managed Foreground Toolset'],
      ['11', 'Reilly-King', 'Future-Proofed Interactive Toolset'],
      [
        '12',
        'Emard, Champlin and Runolfsdottir',
        'Devolved Needs-Based Capability',
      ],
      ['13', 'Fritsch, Cronin and Wolff', 'Open-Source 3Rdgeneration Website'],
      ['14', 'Borer LLC', 'Profit-Focused Incremental Orchestration'],
      ['15', 'Emmerich-Ankunding', 'User-Centric Stable Extranet'],
      ['16', 'Willms-Abbott', 'Progressive Bandwidth-Monitored Access'],
      ['17', 'Brekke PLC', 'Intuitive User-Facing Customerloyalty'],
      ['18', 'Bins, Toy and Klocko', 'Integrated Assymetric Software'],
      ['19', 'Hodkiewicz-Hayes', 'Programmable Systematic Securedline'],
      ['20', 'Murphy, Lang and Ferry', 'Organized Explicit Access'],
    ].map((companyDetails) => ({
      id: companyDetails[0],
      name: companyDetails[1],
      description: companyDetails[2],
      status: companyDetails[3],
    }));
  }
  renderSwimlane(name, clients, ref) {
    return (
      <Swimlane
        name={name}
        clients={clients}
        dragulaRef={ref}
        className="Swimlane-column"
      />
    );
  }

  componentDidMount() {
    const drake = Dragula([
      this.swimlanes.backlog.current,
      this.swimlanes.inProgress.current,
      this.swimlanes.complete.current,
    ]);

    drake.on('drop', (el, target, source, sibling) => {
      switch (target) {
        case this.swimlanes.backlog.current:
          el.className = 'Card Card-grey';
          break;
        case this.swimlanes.inProgress.current:
          el.className = 'Card Card-blue';
          break;
        case this.swimlanes.complete.current:
          el.className = 'Card Card-green';
          break;
        default:
          break;
      }
    });
  }

  render() {
    return (
      <div className="Board">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              {this.renderSwimlane(
                'Backlog',
                this.state.clients.backlog,
                this.swimlanes.backlog
              )}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane(
                'In Progress',
                this.state.clients.inProgress,
                this.swimlanes.inProgress
              )}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane(
                'Complete',
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
