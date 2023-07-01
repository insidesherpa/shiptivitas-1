import React from 'react';
import Swimlane from './Swimlane';
import './Board.css';
import 'dragula/dist/dragula.css';
import reactDragula from 'react-dragula';


/**
 * Approach
 * 1. Declare a state of clients with an empty array for the backlog, in-progress and complete status
 * 2. Use the getclients function to update the state (Components will re-render on any state changes)
 * 3. Check if the app works and verify all  the fields from the API are present on the frontend
 */

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    this.getClients = this.getClients.bind(this);
    this.setState = this.setState.bind(this);
    this.state = {
      clients: {
        backlog: [],
        inProgress:[],
        complete:[],
      }
    }
  }
  
  async getClients() {
    const clients = await fetch('https://shiptivita2.herokuapp.com/api/v1/clients')
    .then(response => response.json())
    
     this.setState ({
     clients: {
      backlog: clients.filter(client => !client.status || client.status === 'backlog'),
      inProgress: clients.filter(client => client.status && client.status === 'in-progress'),
      complete: clients.filter(client => client.status && client.status === 'complete'),
    }
  })
};

  renderSwimlane(name, clients) {
    return (
      <Swimlane name={name} clients={clients} />
    );
  };

  render() {
    console.log("rendered")
    return (
      <div className="Board">
        <div className="container-fluid">
          <div className="row">
            <div id="backlog" className="col-md-4 Swimlane-column">
              {this.renderSwimlane('Backlog', this.state.clients.backlog)}
            </div>
            <div id="inprogress" className="col-md-4 Swimlane-column">
              {this.renderSwimlane('In Progress', this.state.clients.inProgress)}
            </div>
            <div id="complete" className="col-md-4 Swimlane-column">
              {this.renderSwimlane('Complete', this.state.clients.complete)}
            </div>
          </div>
        </div>
      </div>
      
    );
  }

  getCount(id){
    return document.getElementById(id).children.length
  }

  componentDidMount() {
    this.getClients();
    const data = Array.from(document.getElementsByClassName("Swimlane-dragColumn"));
    const ref = reactDragula(data);
    const colors = {
      'Backlog': 'Card-grey',
       "In Progress":"Card-blue",
       "Complete":"Card-green",
    }
    const idMap = {
      'Backlog': 'backlog',
       "In Progress":"in-progress",
       "Complete":"complete",
    }
    ref.on("drop", (el, target, source, sibling) => {
      const className = ['Card']
      className.push(colors[target.id]);
      el.className = className.join(' ');

      console.log(source.id, `: ${this.getCount(source.id)}`,  " to ", target.id, `: ${this.getCount(target.id)}`)
      console.log(el, sibling)
      // console.log("moved from", el.dataset.priority, "in", source.id, "to", sibling.dataset.priority, "in", target.id)

      fetch(`https://shiptivita2.herokuapp.com/api/v1/clients${el.dataset.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({status: idMap[target.id], priority: sibling ? sibling.dataset.priority : this.getCount(target.id) + 1}),
      }).then(() => {
        this.getClients();
      });
    });
  }
}
