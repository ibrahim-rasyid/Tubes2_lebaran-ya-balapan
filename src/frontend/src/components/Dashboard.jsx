import React, {useState, useEffect } from 'react'
import Query from './Query'
import ToggleSwitch from './Switch'
import Slider from './Slider'

export default function Dashboard({onResultChange, onSearch}) {
    const [startPageInput, setStartPageInput] = useState({title:'', url:''})
    const [goalPageInput, setGoalPageInput] = useState({title:'', url:''})
    const [queryResultData, setQueryResultData] = useState([])
    const [isUsingBFS, setIsUsingBFS] = useState(true)
    const [maxResult, setMaxResult] = useState(1)

    function handleModeChange(mode){
      if (!isUsingBFS){
        setMaxResult(1)
      }
      setIsUsingBFS(mode)
    }

    function handleMaxResultChange(e){
      const x = parseInt(e.target.value)
      if (isNaN(x)) {return}
      setMaxResult(x)
    }
    async function handleSubmit(e){
      e.preventDefault()

      if (startPageInput && startPageInput.title != "" && goalPageInput && goalPageInput.title != ""){
        onSearch(true)
        let response
        if (isUsingBFS){
          response = await fetch("http://localhost:8080/bfs", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({startPage: startPageInput.title, goalPage: goalPageInput.title, startUrl: startPageInput.url, goalUrl: goalPageInput.url, maxResult: maxResult.toString()})
          })
        }
        else{
          response = await fetch("http://localhost:8080/ids", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({startPage: startPageInput.title, goalPage: goalPageInput.title, startUrl: startPageInput.url, goalUrl: goalPageInput.url})
          })
        }
        
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        
        const content = await response.json()
        onResultChange(content)
      }
    }
  return (
    <div>
      <form className='w-full relative grid grid-rows-2 gap-30 '>
        <div className='relative grid grid-cols-2 gap-8 z-10' >
          <Query id="query-1" onPageInput={setStartPageInput} pageInput={startPageInput} onQueryResultChange={setQueryResultData} queryResultData={queryResultData} placeholder="Start page"/>
          <Query id="query-2" onPageInput={setGoalPageInput} pageInput={goalPageInput} onQueryResultChange={setQueryResultData} queryResultData={queryResultData} placeholder="Goal page"/>
        </div>
        <div className='relative justify-self-center lg:top-0 top- z-0 flex flex-col'>
          <ToggleSwitch isUsingBFS={isUsingBFS} onModeChange={handleModeChange} />
          <button type='button' className='w-[100px] h-12 border-black border-2 bg-white hover:bg-[#f7f6f5] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] rounded-md mt-5 z-0' onClick={handleSubmit}>Search</button>
        </div>
        <div className='mt-5 z-0 justify-self-center'>
            {isUsingBFS && <Slider onMaxResultChange={handleMaxResultChange} />}
        </div>
      </form>
    </div>
  )
}
