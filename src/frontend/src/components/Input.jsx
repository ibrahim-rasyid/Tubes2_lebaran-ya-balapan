import React, {useState, useEffect } from 'react'


export default function Input({onModeChange}) {
    const [startPage, setStartPage] = useState('')
    const [goalPage, setGoalPage] = useState('')
    const [mode, setMode] = useState(true);

    const endpoint = 'https://en.wikipedia.org/w/api.php?' // for search engine purposes
    const dummyStartPage = "https://en.wikipedia.org/wiki/West_Java"
    
    async function handleSubmit(e){
        e.preventDefault();

        const response = await fetch('http://localhost:8080/bfs', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({startPage: startPage, goalPage: goalPage, startUrl: dummyStartPage, goalUrl: ''})
        })

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const content = await response.json()
        onModeChange()
    }

  return (
    <div>
      <form className='search-engine'>
        <input 
            type="text" 
            placeholder='Start page'
            value={startPage}
            onChange={e => setStartPage(e.target.value)}
        />
        <input 
            type="text" 
            placeholder='Goal page'
            value={goalPage}
            onChange={e => setGoalPage(e.target.value)}
        />
        <div className='btn'>
            <button type='button' onClick={(e) => handleSubmit(e)}>Search with BFS</button>
            <button type='button' onClick={(e) => handleSubmit(e)}>Search with IDS</button>
        </div>
      </form>
    </div>
  )
}
