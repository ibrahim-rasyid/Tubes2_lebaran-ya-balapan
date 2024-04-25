import { useState } from 'react'
import Dashboard from './components/Dashboard'
import Result from './components/Result'
import header from './assets/header.png'
import Graph from './components/Graph'

const dummyData = {
  "result" : [
      [{  "description": "Country in Southeast Asia and Oceanialalalallalalal kskkskskkskskskkskkskskkskskskksksksksksksk lililililil",
          "thumbnailUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Flag_of_Indonesia.svg/160px-Flag_of_Indonesia.svg.png",
          "title": "Indonesia",
          "url": "https://en.wikipedia.org/wiki/Indonesia"},
      {   "description": "Country near the equator in the Pacific Ocean",
          "thumbnailUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Flag_of_the_Marshall_Islands.svg/160px-Flag_of_the_Marshall_Islands.svg.png",
          "title": "Marshall Islands",
          "url": "https://en.wikipedia.org/wiki/Marshall_Islands"},
      {
          "description": "Sovereign state in Oceania, situated on an archipelago",
          "thumbnailUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Flag_of_Tonga.svg/160px-Flag_of_Tonga.svg.png",
          "title": "Tonga",
          "url": "https://en.wikipedia.org/wiki/Tonga"
      }],
      [{  "description": "Country in Southeast Asia and Oceania",
          "thumbnailUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Flag_of_Indonesia.svg/160px-Flag_of_Indonesia.svg.png",
          "title": "Indonesia",
          "url": "https://en.wikipedia.org/wiki/Indonesia"},
      {   "description": "Country near the equator in the Pacific Ocean",
          "thumbnailUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Flag_of_the_Marshall_Islands.svg/160px-Flag_of_the_Marshall_Islands.svg.png",
          "title": "Marshall Islands",
          "url": "https://en.wikipedia.org/wiki/Marshall_Islands"},
      {
          "description": "Sovereign state in Oceania, situated on an archipelago",
          "thumbnailUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Flag_of_Tonga.svg/160px-Flag_of_Tonga.svg.png",
          "title": "Tonga",
          "url": "https://en.wikipedia.org/wiki/Tonga"
      }],
      [{  "description": "Country in Southeast Asia and Oceania",
          "thumbnailUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Flag_of_Indonesia.svg/160px-Flag_of_Indonesia.svg.png",
          "title": "Indonesia",
          "url": "https://en.wikipedia.org/wiki/Indonesia"},
      {   "description": "Country near the equator in the Pacific Ocean",
          "thumbnailUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Flag_of_the_Marshall_Islands.svg/160px-Flag_of_the_Marshall_Islands.svg.png",
          "title": "Marshall Islands",
          "url": "https://en.wikipedia.org/wiki/Marshall_Islands"},
      {
          "description": "Sovereign state in Oceania, situated on an archipelago",
          "thumbnailUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Flag_of_Tonga.svg/160px-Flag_of_Tonga.svg.png",
          "title": "Tonga",
          "url": "https://en.wikipedia.org/wiki/Tonga"
      }]
  ],
  "time" : 10
}

function App() {
  const [isSearching, setIsSearching] = useState(true)
  // const [resultData, setResultData] = useState({result:[], time:0})
  const [resultData, setResultData] = useState(dummyData)

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
          {/* {!isSearching && <Result resultData={resultData}/>}  */}
          {/* <Result resultData={resultData}/> */}
        </div>
      </div>

      {/* <Graph/> */}
    </>
  )
}

export default App
