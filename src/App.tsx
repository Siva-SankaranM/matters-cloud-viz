import './App.css'
import Graph from './components/Graph'
import { ReactFlowProvider } from '@xyflow/react'


function App() {

  return (
    <>
      <ReactFlowProvider>
        <Graph />
      </ReactFlowProvider>
    </>
  )
}

export default App
