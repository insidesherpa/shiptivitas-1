import React from "react";
import Dragula from "dragula";
import "dragula/dist/dragula.css";
import Swimlane from "./Swimlane";
import "./Board.css";

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    // const clients = this.getClients();
    this.state = {
      clients: {
        backlog: [],
        inProgress: [],
        complete: []
      }
    };
    this.swimlanes = {
      backlog: React.createRef(),
      inProgress: React.createRef(),
      complete: React.createRef()
    };
  }

  renderSwimlane(name, clients, ref) {
    return <Swimlane name={name} clients={clients} dragulaRef={ref} />;
  }
  // check if component mounted
  componentDidMount() {
    // initialize function for drag and drop
    this.initializeDragula();
    this.fetchClients(); // Call fetchClients when the component mounts
  }
  api = "http://localhost:3001/api/v1";

  async fetchClients() {
    try {
      const response = await fetch(`${this.api}/clients`);
      const clients = await response.json();
      this.setClients(clients);
    } catch (error) {
      throw new Error("Error fetching clients:", error);
    }
  }

  async changePriorityAPI(id, priority, status) {
    const url = `${this.api}/clients/${id}`;
    const data = {
      priority: priority,
      status: status
    };
    const body = JSON.stringify(data);
    const header = {
      "Content-Type": "application/json"
      // add headers to prevent cors error
    };
    try {
       const response  = await fetch(url, {
        method: "PUT",
        headers: header,
        body: body
      });
      const result = await response.json()
      return result;

    } catch (error) {
      throw new Error("Error updating values",error);
    }
  }
  filterClients(clients, status){
    return clients.filter(
      client => !client.status || client.status === `${status}`
    ).sort((cur, nxt)=> cur.priority - nxt.priority)
  }

  setClients(clients) {
    this.setState({
      clients: {
        backlog: this.filterClients(clients, "backlog"),
        inProgress: this.filterClients(clients, "in-progress"),
        complete: this.filterClients(clients, "complete")
      }
    });
  }
   changePriority(el, targetContainer, containers) {
    const id = el.getAttribute("data-id");
    const statusMapper = ["backlog", "in-progress", "complete"];

    // const objectList = this.state.clients[origin];
    var childList = targetContainer.children;
    var childFound = false;
    for (let childIdx = 0; childIdx < childList.length; childIdx++) {
      var childId = childList[childIdx].getAttribute("data-id");
      if (childId === id) {
        childFound = true;
      }
      if (childFound) {
        // var childObject = objectList.filter(child => child.id === id)
        const target = statusMapper[containers.indexOf(targetContainer)];
        this.changePriorityAPI(childId, childIdx + 1, target)
        .then(value=>{
          console.log(value);
          // this.setClients(value);   
        });
      }
    }
  }
  /**
   * feature function for dragging and dropping and updating the details
   */
  initializeDragula() {
    // map the container references to an array
    const containers = Object.values(this.swimlanes).map(ref => ref.current);
   
    /**
     * Function to change color and status of the card after dragging and dropping
     * @param { Element } cardElement 
     * @param { Element } targetContainer 
     */
    const changeCardAttributes = (cardElement, targetContainer) => {
      // find the index of the target container
      const containerIndex = containers.indexOf(targetContainer);

      // use index as a mapper for class based on swimlane
      const colorMapper = ["Card-grey", "Card-blue", "Card-green"];

      // change the classsName of current card in order to change the color based on swimlane position
      cardElement.className = `Card ${colorMapper[containerIndex]} gu-transit`;
      // change the data-status based on swimlane
      // cardElement.setAttribute("data-status",statusMapper[containerIndex] );

      // console.log(this.state.clients.complete);
      // console.log(containers)
    };
    // find priority of an item
  
    // Initialize Dragula

    // Track the dragged element
    var draggedElement = null;

    // Initialize the drag and drop package function
    Dragula(containers)
      .on("drag", function(el, source){
        // el is the dragged element
        draggedElement = el;
      })
      // Utilize the drop feature as it provides the target container
      .on("drop", (el, targetContainer) => {
        // Call the change card attribute function
        changeCardAttributes(el, targetContainer);

        // find the priority
        this.changePriority(el, targetContainer, containers);
        
        // Check if draggedElement is not null before accessing its attributes
        if (draggedElement) {
          console.log(draggedElement);
          // console.log(draggedElement.getAttribute('data-priority'));
        } else {
          console.log("Dragged element is null");
        }

        // updateClientList(el, targetContainer)
      });
  }

  render() {
    return (
      <div className="Board">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              {this.renderSwimlane(
                "Backlog",
                this.state.clients.backlog,
                this.swimlanes.backlog
              )}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane(
                "In Progress",
                this.state.clients.inProgress,
                this.swimlanes.inProgress
              )}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane(
                "Complete",
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
