import './App.css'
import Graph from './components/Graph'
import { ReactFlowProvider } from '@xyflow/react'
import { rawData } from './data/cloudGraphData'


function App() {
  return (
    <>
      <ReactFlowProvider>
        <Graph graphData={rawData} />
      </ReactFlowProvider>
    </>
  )
}

export default App;
