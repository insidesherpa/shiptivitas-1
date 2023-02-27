// components
import "./Board.css";
import Swimlane from "./Swimlane";
// dragula
import dragula from "dragula";
import "dragula/dist/dragula.css";
// react
import React from "react";
// utils
import { clientsData } from "./utils/data";
import { moveElementToIndex } from "./utils/board";

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

        this.drake = dragula(
            [backlogContainer, inProgressContainer, completedContainer],
            {
                revertOnSpill: true,
            }
        );

        this.drake.on("drop", (element, target, source, sibling) => {
            const {
                dataset: { id: elementId, status: elementStatus },
            } = element;
            const {
                previousElementSibling: { innerHTML: _targetTitle },
            } = target;

            const targetTitle = _targetTitle.toLowerCase().replaceAll(" ", "-");

            let { clients } = this.state;

            let filteredElement, filteredElements;

            // revert changes made to DOM
            this.drake.cancel(true);
            switch (elementStatus) {
                case "backlog":
                    filteredElement = clients.backlog.find(
                        (client) => client.id === elementId
                    );

                    filteredElements = clients.backlog.filter(
                        (client) => client.id !== elementId
                    );
                    this.setState((prevState) => ({
                        ...prevState,
                        clients: {
                            ...prevState.clients,
                            backlog: filteredElements,
                        },
                    }));
                    break;
                case "in-progress":
                    filteredElement = clients.inProgress.find(
                        (client) => client.id === elementId
                    );

                    filteredElements = clients.inProgress.filter(
                        (client) => client.id !== elementId
                    );
                    this.setState((prevState) => ({
                        ...prevState,
                        clients: {
                            ...prevState.clients,
                            inProgress: filteredElements,
                        },
                    }));
                    break;
                case "completed":
                    filteredElement = clients.completed.find(
                        (client) => client.id === elementId
                    );

                    filteredElements = clients.completed.filter(
                        (client) => client.id !== elementId
                    );
                    this.setState((prevState) => ({
                        ...prevState,
                        clients: {
                            ...prevState.clients,
                            completed: filteredElements,
                        },
                    }));
                    break;
                default:
                    break;
            }

            clients = this.state.clients;
            let index;

            switch (targetTitle) {
                case "backlog":
                    index =
                        sibling === null
                            ? -1
                            : clients.backlog.findIndex(
                                  (client) => client.id === sibling.dataset.id
                              );

                    // update filteredElementStatus
                    filteredElement.status = "backlog";

                    let backlog = moveElementToIndex(
                        filteredElement,
                        index,
                        clients.backlog
                    );

                    this.setState((prevState) => ({
                        ...prevState,
                        clients: { ...prevState.clients, backlog },
                    }));
                    break;
                case "in-progress":
                    index =
                        sibling === null
                            ? -1
                            : clients.inProgress.findIndex(
                                  (client) => client.id === sibling.dataset.id
                              );

                    // update filteredElementStatus
                    filteredElement.status = "in-progress";

                    let inProgress = moveElementToIndex(
                        filteredElement,
                        index,
                        clients.inProgress
                    );

                    this.setState((prevState) => ({
                        ...prevState,
                        clients: { ...prevState.clients, inProgress },
                    }));
                    break;
                case "completed":
                    index =
                        sibling == null
                            ? -1
                            : clients.completed.findIndex(
                                  (client) => client.id === sibling.dataset.id
                              );

                    // update filteredElementStatus
                    filteredElement.status = "completed";

                    let completed = moveElementToIndex(
                        filteredElement,
                        index,
                        clients.completed
                    );

                    this.setState((prevState) => ({
                        ...prevState,
                        clients: { ...prevState.clients, completed },
                    }));
                    break;
                default:
                    break;
            }
        });
    }

    componentWillUnmount() {
        this.drake.remove();
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
