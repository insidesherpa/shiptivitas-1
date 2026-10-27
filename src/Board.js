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
  }

  componentDidMount() {
    this.drake = Dragula([
      this.swimlanes.backlog.current,
      this.swimlanes.inProgress.current,
      this.swimlanes.complete.current,
    ]);
    this.drake.on('drop', (el, target, source, sibling) => this.updateClient(el, target, source, sibling));

    this.fetchClients();
  }

  fetchClients() {
    if (typeof fetch !== 'undefined') {
      fetch('http://localhost:3001/api/v1/clients')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            this.setState({
              clients: {
                backlog: data.filter(c => !c.status || c.status === 'backlog').sort((a, b) => a.priority - b.priority),
                inProgress: data.filter(c => c.status === 'in-progress').sort((a, b) => a.priority - b.priority),
                complete: data.filter(c => c.status === 'complete').sort((a, b) => a.priority - b.priority),
              }
            });
          }
        })
        .catch(err => console.error('Failed to fetch clients:', err));
    }
  }

  componentWillUnmount() {
    this.drake.remove();
  }

  /**
   * Change the status of client when a Card is moved
   */
  updateClient(el, target, _, sibling) {
    // Reverting DOM changes from Dragula
    this.drake.cancel(true);

    if (!target) return;

    // Find out which swimlane the Card was moved to
    let targetSwimlane = 'backlog';
    if (target === this.swimlanes.inProgress.current) {
      targetSwimlane = 'in-progress';
    } else if (target === this.swimlanes.complete.current) {
      targetSwimlane = 'complete';
    }

    // Create a new clients array
    const clientsList = [
      ...this.state.clients.backlog,
      ...this.state.clients.inProgress,
      ...this.state.clients.complete,
    ];
    const clientThatMoved = clientsList.find(client => String(client.id) === String(el.dataset.id));
    if (!clientThatMoved) return;

    const clientThatMovedClone = {
      ...clientThatMoved,
      status: targetSwimlane,
    };

    // Remove ClientThatMoved from the clientsList
    const updatedClients = clientsList.filter(client => String(client.id) !== String(clientThatMovedClone.id));

    // Place ClientThatMoved just before the sibling client, keeping the order
    const index = updatedClients.findIndex(client => sibling && String(client.id) === String(sibling.dataset.id));
    updatedClients.splice(index === -1 ? updatedClients.length : index , 0, clientThatMovedClone);

    const newBacklog = updatedClients.filter(client => !client.status || client.status === 'backlog');
    const newInProgress = updatedClients.filter(client => client.status && client.status === 'in-progress');
    const newComplete = updatedClients.filter(client => client.status && client.status === 'complete');

    // Update React state to reflect changes
    this.setState({
      clients: {
        backlog: newBacklog,
        inProgress: newInProgress,
        complete: newComplete,
      }
    });

    const targetList = targetSwimlane === 'backlog'
      ? newBacklog
      : (targetSwimlane === 'in-progress' ? newInProgress : newComplete);
    const newPriority = targetList.findIndex(client => String(client.id) === String(clientThatMovedClone.id)) + 1;

    if (typeof fetch !== 'undefined') {
      fetch(`http://localhost:3001/api/v1/clients/${clientThatMovedClone.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: targetSwimlane,
          priority: newPriority,
        }),
      })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          this.setState({
            clients: {
              backlog: data.filter(c => !c.status || c.status === 'backlog').sort((a, b) => a.priority - b.priority),
              inProgress: data.filter(c => c.status === 'in-progress').sort((a, b) => a.priority - b.priority),
              complete: data.filter(c => c.status === 'complete').sort((a, b) => a.priority - b.priority),
            }
          });
        }
      })
      .catch(err => console.error('Failed to update client:', err));
    }
  }

  getClients() {
    return [
      ['1','Stark, White and Abbott','Cloned Optimal Architecture', 'backlog'],
      ['2','Wiza LLC','Exclusive Bandwidth-Monitored Implementation', 'backlog'],
      ['3','Nolan LLC','Vision-Oriented 4Thgeneration Graphicaluserinterface', 'backlog'],
      ['4','Thompson PLC','Streamlined Regional Knowledgeuser', 'backlog'],
      ['5','Walker-Williamson','Team-Oriented 6Thgeneration Matrix', 'backlog'],
      ['6','Boehm and Sons','Automated Systematic Paradigm', 'backlog'],
      ['7','Runolfsson, Hegmann and Block','Integrated Transitional Strategy', 'backlog'],
      ['8','Schumm-Labadie','Operative Heuristic Challenge', 'backlog'],
      ['9','Kohler Group','Re-Contextualized Multi-Tasking Attitude', 'backlog'],
      ['10','Romaguera Inc','Managed Foreground Toolset', 'backlog'],
      ['11','Reilly-King','Future-Proofed Interactive Toolset', 'backlog'],
      ['12','Emard, Champlin and Runolfsdottir','Devolved Needs-Based Capability', 'backlog'],
      ['13','Fritsch, Cronin and Wolff','Open-Source 3Rdgeneration Website', 'backlog'],
      ['14','Borer LLC','Profit-Focused Incremental Orchestration', 'backlog'],
      ['15','Emmerich-Ankunding','User-Centric Stable Extranet', 'backlog'],
      ['16','Willms-Abbott','Progressive Bandwidth-Monitored Access', 'backlog'],
      ['17','Brekke PLC','Intuitive User-Facing Customerloyalty', 'backlog'],
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
