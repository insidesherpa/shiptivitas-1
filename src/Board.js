import React from 'react';
import Dragula from 'dragula';
import 'dragula/dist/dragula.css';
import Swimlane from './Swimlane';
import './Board.css';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    const clients = this.getClients().map(client => ({ ...client, status: 'backlog' }));
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

  componentDidMount() {
    const containers = [
      this.swimlanes.backlog.current,
      this.swimlanes.inProgress.current,
      this.swimlanes.complete.current,
    ];

    this.drake = Dragula(containers);

    this.drake.on('drop', (el, target, source, sibling) => {
      const clientId = el.getAttribute('data-id');
      let targetLane = '';
      if (target === this.swimlanes.backlog.current) 
        targetLane = 'backlog';

      else if (target === this.swimlanes.inProgress.current) 
        targetLane = 'inProgress';

      else if (target === this.swimlanes.complete.current) 
        targetLane = 'complete';

      let sourceLane = '';

      if (source === this.swimlanes.backlog.current) 
        sourceLane = 'backlog';

      else if (source === this.swimlanes.inProgress.current) 
        sourceLane = 'inProgress';

      else if (source === this.swimlanes.complete.current) 
        sourceLane = 'complete';

      if (!targetLane || !sourceLane) 
        return;

      const backlogList = Array.from(this.state.clients.backlog);

      const inProgressList = Array.from(this.state.clients.inProgress);

      const completeList = Array.from(this.state.clients.complete);

      const lists = {
        backlog: backlogList,
        inProgress: inProgressList,
        complete: completeList
      };

      const sourceList = lists[sourceLane];
      const targetList = lists[targetLane];

      const clientIndex = sourceList.findIndex(c => c.id === clientId);

      if (clientIndex === -1) 
        return;

      const [client] = sourceList.splice(clientIndex, 1);

      let newStatus = 'backlog';

      if (targetLane === 'inProgress') 
        newStatus = 'in-progress';

      else if (targetLane === 'complete') newStatus = 'complete';

      const updatedClient = {
        ...client,
        status: newStatus
      };

      let insertIndex = targetList.length;
      if (sibling) {
        const siblingId = sibling.getAttribute('data-id');
        insertIndex = targetList.findIndex(c => c.id === siblingId);
        
        if (insertIndex === -1) {
          insertIndex = targetList.length;
        }
      }

      targetList.splice(insertIndex, 0, updatedClient);

      this.drake.cancel(true);

      this.setState({
        clients: {
          backlog: backlogList,
          inProgress: inProgressList,
          complete: completeList
        }
      });
    });
  }

  componentWillUnmount() {
    if (this.drake) {
      this.drake.destroy();
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
