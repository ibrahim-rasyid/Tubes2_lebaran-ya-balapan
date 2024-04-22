import { useState } from 'react'
import Dashboard from './components/Dashboard'
// import Title from './components/Title'
// import Result from './components/Result'

function App() {
  const [isUsingBFS, setIsUsingBFS] = useState(true)
  const [resultData, setResultData] = useState([])
  const [isSearchingResult, setIsSearchingResult] = useState(true)

  function handleModeChange(){
    setIsUsingBFS(!isUsingBFS)
  }

  function handleResultChange(result){
    setResultData(result)
  }

  // console.log(resultData)

  return (
    <div className='app'>
      <h1>Wikirace</h1>
      <div className='interaction-container'>
        <Dashboard onModeChange={handleModeChange} onResultChange={handleResultChange}/>
        {/* <Input onSubmit={fetchBezierPoints} onControlPointChange={handleControlPointChange} onIterationChange={handleIterationChange} onModeChange={handleModeChange}/> */}
        {/* <Result type={'BFS'} runtime={}></Result>
        <Result type={'IDS'} runtime={}></Result> */}
      </div>
    </div>
  )
}

export default App
