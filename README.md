

# Interactive Cloud Risk Visualization

[Live on Vercel 🚀](https://matters-cloud-viz.vercel.app/)


## Tech Stack

- **Vite**: Fast build tool and development server for modern web projects. Vite provides instant server start, lightning-fast HMR, and optimized production builds.
- **TypeScript**: Strongly typed superset of JavaScript for safer and more maintainable code. All components and logic are written in TypeScript.
- **React**: UI library for building interactive user interfaces. The graph and UI are built using React components.
- **React Flow**: Library for building node-based UIs and interactive graphs in React. Handles rendering, dragging, connecting, and interaction of nodes and edges.
- **Dagre**: Graph layout algorithm used to automatically position nodes in a directed acyclic graph (DAG) for clear visualization. Integrated with React Flow for automatic layout.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development. Used for styling components and layouts with a modern, responsive design.



## Setup Instructions

1. **Install dependencies:**
  ```zsh
  npm install
  ```
2. **Start the development server:**
  ```zsh
  npm run dev
  ```
3. **Open the app:**
  Visit `http://localhost:5173` in your browser.

---

## Brief Explanation

This project visualizes cloud risk data using an interactive graph. The main features include collapsible nodes and auto-adjusting view port.


## Graph Rendering
- The graph is rendered using React and SVG for scalable visuals.
- **React Flow** manages the graph structure, node/edge rendering, and user interactions (drag, select, connect).
- **Dagre** is used to calculate node positions for a clean, readable layout.
- Nodes and edges are dynamically generated from data.
- Layout and positioning are handled in the `Graph.tsx` and `CustomNode.tsx` components.
- Icons for node types and status are provided by the `lucide-react` library for a modern, consistent look (see `CustomNode.tsx`).

## Filtering Logic
- The filter state is managed in React using a state variable (activeFilter).
- When a filter is selected (e.g., "Alerts" or "Misconfigurations"), the graph component recalculates which nodes and edges should be visible.
- The filtering is performed by a helper function (passesFilter) that checks each node:
- If the "Alerts" filter is active, only nodes with one or more alerts (node.alerts >= 1) are shown.
- If the "Misconfigurations" filter is active, only nodes with one or more misconfigurations (node.misconfigs >= 1) are shown.
- If "All" is selected, all nodes are shown.
- The graph is then rebuilt to include only nodes and edges that pass the filter, and the UI updates in real time.


### Collapsibility
- Nodes in the graph can be expanded or collapsed to show or hide their children.
- The state of each node (collapsed/expanded) is managed in React state.
- Clicking a node toggles its collapsed state, updating the graph view accordingly.
- When nodes are collapsed or expanded, the viewport is automatically adjusted using React Flow's `fitView` function to keep all visible nodes in view.

---

For more details, see the source code in `src/components/Graph.tsx` and `src/components/CustomNode.tsx`.
