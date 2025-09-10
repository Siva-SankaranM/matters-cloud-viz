

# Cloud Risk Visualization

## Tech Stack

- **Vite**: Fast build tool and development server for modern web projects. Vite provides instant server start, lightning-fast HMR, and optimized production builds.
- **TypeScript**: Strongly typed superset of JavaScript for safer and more maintainable code. All components and logic are written in TypeScript.
- **React**: UI library for building interactive user interfaces. The graph and UI are built using React components.
- **React Flow**: Library for building node-based UIs and interactive graphs in React. Handles rendering, dragging, connecting, and interaction of nodes and edges.
- **Dagre**: Graph layout algorithm used to automatically position nodes in a directed acyclic graph (DAG) for clear visualization. Integrated with React Flow for automatic layout.


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

This project visualizes cloud risk data using an interactive graph. The main features include collapsible nodes and dynamic filtering.


### Collapsibility
- Nodes in the graph can be expanded or collapsed to show or hide their children.
- The state of each node (collapsed/expanded) is managed in React state.
- Clicking a node toggles its collapsed state, updating the graph view accordingly.
- When nodes are collapsed or expanded, the viewport is automatically adjusted using React Flow's `fitView` function to keep all visible nodes in view.

### Filtering
- Users can filter nodes based on risk level or other criteria.
- Filtering updates the graph to show only nodes matching the selected filters.
- The filtering logic is implemented in the graph component, which recalculates visible nodes and edges based on filter state.

---



## Graph Rendering
- The graph is rendered using React and SVG for scalable visuals.
- **React Flow** manages the graph structure, node/edge rendering, and user interactions (drag, select, connect).
- **Dagre** is used to calculate node positions for a clean, readable layout.
- Nodes and edges are dynamically generated from data.
- Layout and positioning are handled in the `Graph.tsx` and `CustomNode.tsx` components.
- Icons for node types and status are provided by the `lucide-react` library for a modern, consistent look (see `CustomNode.tsx`).

## Filtering Logic
- Filter state is managed in React (e.g., via hooks or context).
- When filters change, the graph data is reprocessed to include only matching nodes and edges.
- Filtering is efficient and updates the UI in real time.

## Collapsible Node Functionality
- Each node tracks its collapsed/expanded state.
- Clicking a node toggles its state and updates the graph.
- Child nodes are hidden when a parent is collapsed, improving readability for large graphs.

---

For more details, see the source code in `src/components/Graph.tsx` and `src/components/CustomNode.tsx`.
