import React, { useState } from 'react';
import Dragula from 'react-dragula';
import 'react-dragula/dist/dragula.css';
import './ShippingRequests.css'; // Import your existing CSS for the component

const ShippingRequests = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Task 1', status: 'backlog' },
    { id: 2, title: 'Task 2', status: 'backlog' },
    // Add more tasks as needed
  ]);

  const handleDrop = (el, target, source) => {
    const taskId = parseInt(el.dataset.id, 10);
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, status: target.dataset.status } : task
    );
    setTasks(updatedTasks);
  };

  return (
    <div className="kanban-board">
      <div className="swimlane backlog" data-status="backlog">
        <h2>Backlog</h2>
        {tasks
          .filter(task => task.status === 'backlog')
          .map(task => (
            <div
              key={task.id}
              data-id={task.id}
              className="card"
              draggable="true"
            >
              {task.title}
            </div>
          ))}
      </div>
      <div className="swimlane in-progress" data-status="in-progress">
        <h2>In Progress</h2>
        {tasks
          .filter(task => task.status === 'in-progress')
          .map(task => (
            <div
              key={task.id}
              data-id={task.id}
              className="card"
              draggable="true"
            >
              {task.title}
            </div>
          ))}
      </div>
      <div className="swimlane complete" data-status="complete">
        <h2>Complete</h2>
        {tasks
          .filter(task => task.status === 'complete')
          .map(task => (
            <div
              key={task.id}
              data-id={task.id}
              className="card"
              draggable="true"
            >
              {task.title}
            </div>
          ))}
      </div>
      <Dragula
        containers={['.backlog', '.in-progress', '.complete']}
        onDrop={handleDrop}
      />
    </div>
  );
};

export default ShippingRequests;