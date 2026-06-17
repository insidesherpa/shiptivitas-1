# Shiptivitas Kanban Board Feature Implementation Report

**Author:** Subhajit Sarkar 
**Date:** June 15, 2026  
**Subject:** Kanban Board Drag-and-Drop Implementation & Verification Document

---

## 1. Executive Summary

This document presents a comprehensive report on the frontend implementation of the Kanban board feature in the Shiptivitas shipping productivity application. The feature enables users to seamlessly manage, reorder, and track shipping requests across three progress stages: **Backlog**, **In Progress**, and **Complete**. 

All work has been completed in compliance with the frontend-only requirements, integrating the **Dragula** library with **React** while maintaining strict state synchronization and user interface responsiveness.

---

## 2. Alignment with Acceptance Criteria

The table below outlines how each of the specific Acceptance Criteria defined in the project requirements has been met:

| Acceptance Criterion | Implementation Details | Verification |
| :--- | :--- | :--- |
| **1. All tasks must show in the backlog swimlane initially.** | The constructor was updated to map over the mock database and initialize every client's status to `'backlog'`. | On component mount, the "In Progress" and "Complete" lanes are empty; all 20 cards populate the "Backlog" column. |
| **2. There should be 3 swimlanes.** | The board template maintains three explicit columns representing the target workflows. | Verified columns for "Backlog", "In Progress", and "Complete" are visible and distinct. |
| **3. Dragging a card reorders the card and stays there (frontend only).** | Dragula is initialized across all three swimlane refs. Drop locations are calculated relative to sibling nodes, updating React state arrays. | Cards can be moved within a lane (reordered) or moved to other lanes, persisting layout configurations. |
| **4. When a card changes swimlane, it should change color.** | Moving a card to another lane updates the card's `status` attribute in state. The `Card` component reactively applies the corresponding styling class. | Backlog cards are **Grey**; In Progress cards change to **Blue**; Completed cards change to **Green**. |

---

## 3. Code Modifications & Technical Rationale

### Modification 1: Package Execution Configuration
* **File affected:** Running Command Environment
* **Action:** Utilized `NODE_OPTIONS=--openssl-legacy-provider` during start and test phases.
* **Rationale:** The project's legacy Webpack configuration (`react-scripts: 2.1.3`) is incompatible with the default OpenSSL v3 configuration in modern Node.js runtimes (Node.js v17+). Specifying the legacy provider ensures development servers can compile the application without requiring modifications to the base dependency versions in `package.json`.

---

### Modification 2: Initial Task Distribution
* **File affected:** [src/Board.js](https://github.com/subx6789/shiptivitas-1/blob/master/src/Board.js) (Constructor)
* **Changes:**
  ```javascript
  const clients = this.getClients().map(client => ({ ...client, status: 'backlog' }));
  this.state = {
    clients: {
      backlog: clients,
      inProgress: [],
      complete: [],
    }
  }
  ```
* **Rationale:** Overrides any hardcoded statuses returned by the database helper on the client side. This satisfies the first criterion by ensuring all shipping requests start in the Backlog lane when the user loads the screen.

---

### Modification 3: Dragula Drag-and-Drop Event Handling
* **File affected:** [src/Board.js](https://github.com/subx6789/shiptivitas-1/blob/master/src/Board.js) (Lifecycle methods)
* **Changes:**
  * Initialized `Dragula` with refs pointing to the drag column containers.
  * Implemented a `drop` callback that performs a safe data transfer between state arrays.
  * Intercepted Dragula's default DOM manipulation by calling `this.drake.cancel(true)` and subsequently updating state to trigger a clean React re-render.
* **Rationale:** Standard React components track UI representations using virtual DOM nodes. If a library like Dragula directly mutates the actual DOM without updating React's internal state, the React compiler will conflict with the DOM layout on subsequent renders. Reverting the raw DOM drop immediately and pushing state updates down ensures React maintains a single source of truth, avoiding rendering collisions.

---

### Modification 4: Visual Polish & User Experience
* **Files affected:** [src/Board.js](https://github.com/subx6789/shiptivitas-1/blob/master/src/Board.js) and [src/Card.css](https://github.com/subx6789/shiptivitas-1/blob/master/src/Card.css)
* **Changes:**
  * Imported the vendor stylesheet `'dragula/dist/dragula.css'` in `Board.js` to inherit Dragula's default CSS rules (`.gu-mirror`, `.gu-transit`, `.gu-hide`, and `.gu-unselectable`) for smooth card dragging overlays and shadows.
  * Added `cursor: pointer;` to the `.Card` selector in `Card.css` to improve user experience.
* **Rationale:** Standardizes cursor feedback to signal to the user that card elements are draggable. Importing the Dragula library's default stylesheet is necessary to prevent card elements from snapping, disappearing, or shifting layout unexpectedly when dragged.

---

## 4. Architectural Analysis & Core Thought Process

React applications rely on a **directional data flow** where data flows down and UI updates propagate upward. When implementing drag-and-drop mechanics, developers face two main strategies:

1. **State-Reconciled Mutation (Chosen Approach)**: Reverting the library's physical DOM changes instantly, shifting the business data array elements in React's component state, and letting React render the changes.
2. **DOM-Override Integration**: Allowing Dragula to keep the moved elements, bypassing the virtual DOM, and syncing the data passively.

The **State-Reconciled Mutation** strategy was chosen to guarantee that the UI and the data array indexes remain strictly coupled.