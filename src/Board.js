// components
import "./Board.css";
import Swimlane from "./Swimlane";
// data
import { clientsData } from "./data";
// dragula
import dragula from "dragula";
import "dragula/dist/dragula.css";
// react
import React from "react";

export default class Board extends React.Component {
    constructor(props) {
        super(props);
        const clients = this.getClients();
        this.state = {
            clients: {
                backlog: clients.filter(
                    (client) => !client.status || client.status === "backlog"
                ),
                inProgress: clients.filter(
                    (client) => client.status && client.status === "in-progress"
                ),
                completed: clients.filter(
                    (client) => client.status && client.status === "completed"
                ),
            },
        };
        this.swimlanes = {
            backlog: React.createRef(),
            inProgress: React.createRef(),
            completed: React.createRef(),
        };
    }
    getClients() {
        return clientsData.map((companyDetails) => ({
            id: companyDetails[0],
            name: companyDetails[1],
            description: companyDetails[2],
            status: companyDetails[3],
        }));
    }
    renderSwimlane(name, clients, ref) {
        return <Swimlane name={name} clients={clients} dragulaRef={ref} />;
    }

    componentDidMount() {
        const backlogContainer = this.swimlanes.backlog.current;
        const inProgressContainer = this.swimlanes.inProgress.current;
        const completedContainer = this.swimlanes.completed.current;

        const drake = dragula(
            [backlogContainer, inProgressContainer, completedContainer],
            {
                revertOnSpill: true,
            }
        );

        drake.on("drop", (element, target, source, sibling) => {
            let {
                previousElementSibling: { innerHTML: targetTitle },
            } = target;

            targetTitle = targetTitle.toLowerCase().replaceAll(" ", "-");

            switch (targetTitle) {
                case "backlog":
                    element.className = "Card Card-grey";
                    break;
                case "in-progress":
                    element.className = "Card Card-blue";
                    break;
                case "completed":
                    element.className = "Card Card-green";
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
                                "Completed",
                                this.state.clients.completed,
                                this.swimlanes.completed
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
