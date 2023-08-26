import React, { Component } from 'react';
import Dragula from 'dragula';
import 'dragula/dist/dragula.css';
import Swimlane from './Swimlane';
import './Board.css';

export default class Board extends Component {
  state = {
    clients: {
      backlog: [],
      inProgress: [],
      complete: [],
    },
  };

  componentDidMount() {
    const clients = this.getClients();
    this.setState({
      clients: {
        backlog: clients.filter(client => client.status === 'backlog'),
        inProgress: clients.filter(client => client.status === 'in-progress'),
        complete: clients.filter(client => client.status === 'complete'),
      },
    }, () => {
      this.initializeDragula();
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

  handleCardDrop = (clientID, newStatus) => {
    const updatedClients = { ...this.state.clients };
    const clientToUpdate = Object.values(updatedClients)
      .flat()
      .find(client => client.id === clientID);

    if (clientToUpdate) {
      clientToUpdate.status = newStatus;
      this.setState({ clients: updatedClients });
    }
  };

  initializeDragula() {
    const swimlanes = ['backlog', 'inProgress', 'complete'];
    swimlanes.forEach(swimlane => {
      this[swimlane + 'Drake'] = Dragula([this[swimlane]], {
        moves: (el, source, handle, sibling) => !el.classList.contains('no-drag'),
      });
      this[swimlane + 'Drake'].on('drop', (el, target, source) => {
        const newStatus = target.dataset.status;
        const clientID = el.dataset.id;
        this.handleCardDrop(clientID, newStatus);
      });
    });
  }

  render() {
    const { backlog, inProgress, complete } = this.state.clients;
    return (
      <div className="Board">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              <Swimlane name="Backlog" clients={backlog} onCardDrop={this.handleCardDrop} />
            </div>
            <div className="col-md-4">
              <Swimlane name="In Progress" clients={inProgress} onCardDrop={this.handleCardDrop} />
            </div>
            <div className="col-md-4">
              <Swimlane name="Complete" clients={complete} onCardDrop={this.handleCardDrop} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}


