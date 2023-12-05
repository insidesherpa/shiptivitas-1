import React, { useState, useRef, useEffect } from "react";
import Dragula from "dragula";
import "dragula/dist/dragula.css";
import Swimlane from "./Swimlane";
import "./Board.css";

const Board = () => {
  const swimlanes = {
    backlog: useRef(),
    inProgress: useRef(),
    complete: useRef(),
  };

  const getClients = () => {
    return [
      [
        "1",
        "Stark, White and Abbott",
        "Cloned Optimal Architecture",
        "in-progress",
      ],
      [
        "2",
        "Wiza LLC",
        "Exclusive Bandwidth-Monitored Implementation",
        "complete",
      ],
      [
        "3",
        "Nolan LLC",
        "Vision-Oriented 4Thgeneration Graphicaluserinterface",
        "backlog",
      ],
      [
        "4",
        "Thompson PLC",
        "Streamlined Regional Knowledgeuser",
        "in-progress",
      ],
      [
        "5",
        "Walker-Williamson",
        "Team-Oriented 6Thgeneration Matrix",
        "in-progress",
      ],
      ["6", "Boehm and Sons", "Automated Systematic Paradigm", "backlog"],
      [
        "7",
        "Runolfsson, Hegmann and Block",
        "Integrated Transitional Strategy",
        "backlog",
      ],
      ["8", "Schumm-Labadie", "Operative Heuristic Challenge", "backlog"],
      [
        "9",
        "Kohler Group",
        "Re-Contextualized Multi-Tasking Attitude",
        "backlog",
      ],
      ["10", "Romaguera Inc", "Managed Foreground Toolset", "backlog"],
      ["11", "Reilly-King", "Future-Proofed Interactive Toolset", "complete"],
      [
        "12",
        "Emard, Champlin and Runolfsdottir",
        "Devolved Needs-Based Capability",
        "backlog",
      ],
      [
        "13",
        "Fritsch, Cronin and Wolff",
        "Open-Source 3Rdgeneration Website",
        "complete",
      ],
      [
        "14",
        "Borer LLC",
        "Profit-Focused Incremental Orchestration",
        "backlog",
      ],
      [
        "15",
        "Emmerich-Ankunding",
        "User-Centric Stable Extranet",
        "in-progress",
      ],
      [
        "16",
        "Willms-Abbott",
        "Progressive Bandwidth-Monitored Access",
        "in-progress",
      ],
      ["17", "Brekke PLC", "Intuitive User-Facing Customerloyalty", "complete"],
      [
        "18",
        "Bins, Toy and Klocko",
        "Integrated Assymetric Software",
        "backlog",
      ],
      [
        "19",
        "Hodkiewicz-Hayes",
        "Programmable Systematic Securedline",
        "backlog",
      ],
      ["20", "Murphy, Lang and Ferry", "Organized Explicit Access", "backlog"],
    ].map((companyDetails) => ({
      id: companyDetails[0],
      name: companyDetails[1],
      description: companyDetails[2],
      status: companyDetails[3],
    }));
  };

  const [clients, setClients] = useState({
    backlog: [],
    inProgress: [],
    complete: [],
  });

  const getClassName = (status) => {
    switch (status) {
      case "backlog":
        return "Card-grey";
      case "in-progress":
        return "Card-blue";
      case "complete":
        return "Card-green";
      default:
        return "Card";
    }
  };

  useEffect(() => {
    const clientData = getClients();
    setClients({
      backlog: clientData,

      // inProgress: clientData.filter(client => client.status && client.status === 'in-progress'),
      inProgress: [],

      // complete: clientData.filter(client => client.status && client.status === 'complete'),
      complete: [],
    });
    const containers = Object.values(swimlanes).map((ref) => ref.current);
    console.log(containers);

    const drake = Dragula(containers);
    drake.on("drop", function (el, target, source, sibling) {
      console.log(el);
      console.log(target);
      let currentStatus = el.getAttribute("data-status");
      let targetStatus = target.getAttribute("data-status");
      el.classList.remove(getClassName(currentStatus));
      if (currentStatus !== targetStatus) {
        currentStatus = targetStatus;
        el.setAttribute("data-status", currentStatus);
        console.log(currentStatus, " Current");
        console.log(targetStatus, " Target");
        el.classList.add(getClassName(targetStatus));
      } else {
        el.classList.add(getClassName(currentStatus));
      }

      return true;
    });

    return () => {
      drake.destroy();
    };
  }, []);

  // I have Tried class component, the below code but it seems duplicating the cards

  //   componentDidMount() {
  //     const drake = Dragula([
  //       this.swimlanes.inProgress.current,
  //         this.swimlanes.backlog.current,
  //         this.swimlanes.complete.current,
  //     ]);

  //     drake.on("drop", (el, target, source) => {

  //         const taskId = el.getAttribute('data-id');
  //         const currentStatusHTML = source.innerHTML;
  //         const newStatusHTML = target.innerHTML;

  //         const parser = new DOMParser();
  //         const doc1 = parser.parseFromString(currentStatusHTML, "text/html");
  //         const outerDiv = doc1.querySelector(".Card");
  //         let dataStatusValue = "";
  //         if (outerDiv) {
  //             dataStatusValue = outerDiv.getAttribute("data-status") || "nil";
  //             console.log("new console :" , dataStatusValue)
  //         }
  //         const doc2 = parser.parseFromString(newStatusHTML, "text/html");
  //         const newOuterDiv = doc2.querySelector(".Card");
  //         let newDataStatusValue = "";
  //         if (newOuterDiv) {
  //             newDataStatusValue = newOuterDiv.getAttribute("data-status") || "nil";
  //         }
  //         console.log(dataStatusValue, newDataStatusValue);
  //         this.updateCardStatus(taskId, dataStatusValue, newDataStatusValue);

  //       });
  // }
  // componentWillUnmount(){
  //   this.drake.remove();
  // }

  // updateCardStatus = (taskId, currentStatus, newStatus) => {
  //   console.log(`Moving card ${taskId} from ${currentStatus} to ${newStatus}`);
  //   this.setState((prevState) => {
  //     const updatedClients = { ...prevState.clients };
  //     const card = this.findCard(taskId, updatedClients);
  //     if (card) {
  //       // Log the original card data for debugging
  //       console.log('Original Card:', card);

  //       // Update the status of the card
  //       card.status = newStatus;

  //       // Initialize the newStatus key if it doesn't exist
  //       if (!updatedClients[newStatus]) {
  //         updatedClients[newStatus] = [];
  //       }

  //       // Log the state before modification for debugging
  //       console.log('Before state update:', updatedClients);

  //       // Remove the card from the currentStatus array
  //       if (updatedClients[currentStatus]) {
  //         updatedClients[currentStatus] = updatedClients[currentStatus].filter((c) => c.id !== taskId);
  //       }

  //       // Log the state after removing the card for debugging
  //       console.log('After removal:', updatedClients);

  //       // Check if the card already exists in the newStatus array
  //       const isCardInNewStatus = updatedClients[newStatus].some((c) => c.id === taskId);

  //       if (!isCardInNewStatus) {
  //         // Push the card to the newStatus array only if it doesn't exist
  //         updatedClients[newStatus].push(card);
  //         console.log("Card already: ", newStatus, card)
  //       }

  //       // Log the final state after updating for debugging
  //       console.log('After state update:', updatedClients);
  //     }

  //     return { clients: updatedClients };
  //   });
  // };

  //   findCard = (taskId, clients) => {
  //     for (const status in clients) {
  //       const foundCard = clients[status].find(card => String(card.id) === String(taskId));
  //       if (foundCard) {
  //         return foundCard;
  //       }
  //     }
  //     return null;
  //   };

  const renderSwimlane = (name, clients, ref) => {
    return <Swimlane name={name} clients={clients} dragulaRef={ref} />;
  };

  return (
    <div className="Board">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-4">
            {renderSwimlane("Backlog", clients.backlog, swimlanes.backlog)}
          </div>
          <div className="col-md-4">
            {renderSwimlane(
              "In Progress",
              clients.inProgress,
              swimlanes.inProgress
            )}
          </div>
          <div className="col-md-4">
            {renderSwimlane("Complete", clients.complete, swimlanes.complete)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Board;
