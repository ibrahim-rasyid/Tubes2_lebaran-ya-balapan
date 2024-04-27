import { useState } from 'react'
import Dashboard from './components/Dashboard'
import Result from './components/Result'
import header from './assets/header.png'

function App() {
  const [isSearching, setIsSearching] = useState(true)
  const [resultData, setResultData] = useState({steps:[], accessed: 0, n_step: 0, time:0})

  function handleResultChange(result){
    setResultData(result)
    setIsSearching(false)
  }
  
  return (
    <>
      <div className='app '>
        <img src={header} className='mx-auto' />
        <p className='text-center text-2xl mb-5 ' >Find shortest path from</p>
        <div>
          <Dashboard onResultChange={handleResultChange} onSearch={setIsSearching} isSearching={isSearching} />
          {!isSearching && <Result resultData={resultData}/>} 
        </div>
      </div>
    </>
  )
}

export default App
