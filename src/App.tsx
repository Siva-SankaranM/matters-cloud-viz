import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Graph from './components/Graph'
import { ReactFlowProvider } from '@xyflow/react'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ReactFlowProvider>
        <Graph />
      </ReactFlowProvider>
    </>
  )
}

export default App
