# Kanban Board Implementation Details & Thought Process

## Problem Overview

The objective was to implement a fully functional frontend Kanban board that allows shipping requests to be dragged, dropped, and reordered across three distinct swimlanes (`Backlog`, `In Progress`, and `Complete`). The primary technical challenge was integrating the third-party DOM-manipulating library (**Dragula**) cleanly with **React's** state-driven virtual DOM rendering cycle.

---

## Technical Approach & Architecture

To achieve a seamless and bug-free user experience, the implementation uses a coordinated state-and-DOM sync pattern.

### 1. Initial State Definition
* **Requirement**: All tasks must start in the `Backlog` swimlane.
* **Solution**: During constructor initialization in `Board.js`, we map over the retrieved client list, explicitly set each task's `status` to `'backlog'`, and assign the entire array to the `backlog` property in the React state. The remaining lists (`inProgress` and `complete`) are initialized as empty arrays.

### 2. Drag-and-Drop Hook (Dragula)
* **Integration**: In the `componentDidMount` lifecycle hook, React `ref` containers for the three swimlanes are passed into the `Dragula` initializer. This registers the DOM containers as valid drop targets and enables drag-and-drop behavior.

### 3. State Synchronization (The "Cancel-and-Render" Pattern)
Allowing a direct DOM-manipulating library like Dragula to permanently rearrange elements can cause React's virtual DOM reconciliation to mismatch with the actual DOM. To resolve this, a synchronized transaction is executed when a card is dropped:

1. **Transaction Interception**: We listen to the `'drop'` event which exposes the dragged element (`el`), the target lane container (`target`), the source lane container (`source`), and the successor element (`sibling`).
2. **Identify lanes and IDs**: By mapping container references to our state properties (`backlog`, `inProgress`, and `complete`), we determine exactly where the card originated and where it was dropped. We retrieve the card's ID via its `data-id` attribute.
3. **Revert DOM Modifications**: We immediately execute `this.drake.cancel(true)`. This reverts Dragula's direct DOM changes, returning the card to its original position.
4. **Update React State**:
   - The moving client is located and removed from the source list.
   - The client's `status` is updated based on the destination lane:
     * `Backlog` $\rightarrow$ `'backlog'`
     * `In Progress` $\rightarrow$ `'in-progress'`
     * `Complete` $\rightarrow$ `'complete'`
   - The client is inserted at the precise index in the target list (determined by finding the index of the `sibling` element in that lane, or appending to the end if no sibling exists).
5. **Re-render**: Calling `setState` triggers a clean React virtual DOM reconciliation, rendering the card in its new position and updating its styling (color class) automatically based on the new status.

---

## Benefits of this Solution
* **Data Integrity**: React remains the single source of truth for the application state.
* **Styling Consistency**: Card colors update reactively according to the destination swimlane rules defined in `Card.js`.
* **Stability**: By canceling Dragula's direct DOM mutation and letting React handle the render cycle, we prevent visual glitches, key collisions, or React reconciliation crashes.