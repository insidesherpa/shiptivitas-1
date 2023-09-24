import React, { useState, useRef, useEffect } from 'react';
import Dragula from 'dragula';
import 'dragula/dist/dragula.css';
import Swimlane from './Swimlane';
import './Board.css';

const Board = () => {

  const swimlanes = {
    backlog: useRef(),
    inProgress: useRef(),
    complete: useRef(),
  };

  const getClients = () => {
    return [
      ['1', 'Stark, White and Abbott', 'Cloned Optimal Architecture', 'in-progress'],
      ['2', 'Wiza LLC', 'Exclusive Bandwidth-Monitored Implementation', 'complete'],
      ['3', 'Nolan LLC', 'Vision-Oriented 4Thgeneration Graphicaluserinterface', 'backlog'],
      ['4', 'Thompson PLC', 'Streamlined Regional Knowledgeuser', 'in-progress'],
      ['5', 'Walker-Williamson', 'Team-Oriented 6Thgeneration Matrix', 'in-progress'],
      ['6', 'Boehm and Sons', 'Automated Systematic Paradigm', 'backlog'],
      ['7', 'Runolfsson, Hegmann and Block', 'Integrated Transitional Strategy', 'backlog'],
      ['8', 'Schumm-Labadie', 'Operative Heuristic Challenge', 'backlog'],
      ['9', 'Kohler Group', 'Re-Contextualized Multi-Tasking Attitude', 'backlog'],
      ['10', 'Romaguera Inc', 'Managed Foreground Toolset', 'backlog'],
      ['11', 'Reilly-King', 'Future-Proofed Interactive Toolset', 'complete'],
      ['12', 'Emard, Champlin and Runolfsdottir', 'Devolved Needs-Based Capability', 'backlog'],
      ['13', 'Fritsch, Cronin and Wolff', 'Open-Source 3Rdgeneration Website', 'complete'],
      ['14', 'Borer LLC', 'Profit-Focused Incremental Orchestration', 'backlog'],
      ['15', 'Emmerich-Ankunding', 'User-Centric Stable Extranet', 'in-progress'],
      ['16', 'Willms-Abbott', 'Progressive Bandwidth-Monitored Access', 'in-progress'],
      ['17', 'Brekke PLC', 'Intuitive User-Facing Customerloyalty', 'complete'],
      ['18', 'Bins, Toy and Klocko', 'Integrated Assymetric Software', 'backlog'],
      ['19', 'Hodkiewicz-Hayes', 'Programmable Systematic Securedline', 'backlog'],
      ['20', 'Murphy, Lang and Ferry', 'Organized Explicit Access', 'backlog'],
    ].map(companyDetails => ({
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
      case 'backlog':
        return 'Card-grey';
      case 'in-progress':
        return 'Card-blue';
      case 'complete':
        return 'Card-green';
      default:
        return 'Card';
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
    // Our containers which will hold cards aka Swimlanes
    const containers = Object.values(swimlanes).map(ref => ref.current);
    // console.log(containers);
    // Initialized Dragula after rendering
    const drake = Dragula(containers);
    // Event listener to update card's class when it's dropped
    drake.on('drop', function (el, target, source, sibling) {
      // console.log(el);
      // console.log(target);
      let currentStatus = el.getAttribute('data-status');
      let targetStatus = target.getAttribute('data-status');
      el.classList.remove(getClassName(currentStatus));
      if (currentStatus !== targetStatus) {
        currentStatus = targetStatus;
        el.setAttribute('data-status', currentStatus);
        // console.log(currentStatus, " Current"); 
        // console.log(targetStatus, " Target");
        el.classList.add(getClassName(targetStatus))
      }
      else {
        el.classList.add(getClassName(currentStatus));
      }

      return true;
    });

    return () => {
      // Removing any event listeners when component unmounts
      drake.destroy();
    };
  }, []);


  const renderSwimlane = (name, clients, ref) => {
    return <Swimlane name={name} clients={clients} dragulaRef={ref} />;
  };

  return (
    <div className="Board">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-4">
            {renderSwimlane('Backlog', clients.backlog, swimlanes.backlog)}
          </div>
          <div className="col-md-4">
            {renderSwimlane('In Progress', clients.inProgress, swimlanes.inProgress)}
          </div>
          <div className="col-md-4">
            {renderSwimlane('Complete', clients.complete, swimlanes.complete)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Board;
