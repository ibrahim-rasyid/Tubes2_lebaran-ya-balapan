import React, {useState, useEffect } from 'react'
import Query from './Query';
import ToggleSwitch from './Switch';

export default function Dashboard({onResultChange, onSearch}) {
    const [startPageInput, setStartPageInput] = useState({title:'', url:''})
    const [goalPageInput, setGoalPageInput] = useState({title:'', url:''})
    const [queryResultData, setQueryResultData] = useState([])
    const [isUsingBFS, setIsUsingBFS] = useState(true)

    function handleModeChange(mode){
      setIsUsingBFS(mode)
    }

    async function handleSubmit(e){
      e.preventDefault()

      if (startPageInput && startPageInput.title != "" && goalPageInput && goalPageInput.title != ""){
        onSearch(true)
        const response = await fetch(`http://localhost:8080/${isUsingBFS? 'bfs' : 'ids'}`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({startPage: startPageInput.title, goalPage: goalPageInput.title, startUrl: startPageInput.url, goalUrl: goalPageInput.url})
        })
        
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
          <Query onPageInput={setStartPageInput} pageInput={startPageInput} onQueryResultChange={setQueryResultData} queryResultData={queryResultData} placeholder="Start page"/>
          <Query onPageInput={setGoalPageInput} pageInput={goalPageInput} onQueryResultChange={setQueryResultData} queryResultData={queryResultData} placeholder="Goal page"/>
        </div>
        <div className='relative justify-self-center lg:top-0 top- z-0 flex flex-col'>
          <ToggleSwitch isUsingBFS={isUsingBFS} onModeChange={handleModeChange} />
          <button type='button' className='w-[100px] h-12 border-black border-2 bg-white hover:bg-[#efecea] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] rounded-md mt-5 z-0' onClick={handleSubmit}>Search</button>
        </div>
      </form>
    </div>
  )
}
