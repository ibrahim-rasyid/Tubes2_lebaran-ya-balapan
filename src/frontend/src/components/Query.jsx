import React, {useState, useEffect } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import axios from "axios"

export default function Query({onPageInput, pageInput, onQueryResultChange, queryResultData, placeholder}) {
    const [isCollapsed, setIsCollapsed] = useState(true)
    const [selectedPage, setSelectedPage] = useState({})

    const endpoint = 'https://en.wikipedia.org/w/api.php?' // for search engine purposes
    const params = {
      action: "query",
      format: "json",
      generator: "prefixsearch",
      prop: "info|pageprops|pageimages|pageterms",
      ppprop: "displaytitle",
      piprop: "thumbnail",
      pithumbsize: 160,
      pilimit: 30,
      wbptterms: "description",
      gpsnamespace: 0,
      gpslimit: 5,
      inprop: "url",
      origin: "*"
    }

    async function fetchWikiPage(e){
        e.preventDefault()
        params.gpssearch = pageInput
        console.log(pageInput)
        try {
          const wikiresponse = await axios.get(endpoint, { params })
          if (wikiresponse.error){
            throw new Error("Fail fetching wikipedia page");
          }
          onQueryResultChange(Object.values(wikiresponse.data.query.pages))
          setIsCollapsed(false)
          return Object.values(wikiresponse.data.query.pages)
        } catch (error) {
          console.log("Unexpected error occured")
        }
      }

    function handleQueryClick(e,page){
        onPageInput(page.title)
        setIsCollapsed(true)
        setSelectedPage(page)
    }

  return (
    <div className='relative '>
        <input 
            type="search" 
            placeholder= {placeholder}
            className='w-full p-4 rounded-full bg-[#f8f5f2] '
            value={pageInput}
            onChange={e => onPageInput(e.target.value)}
        />
        <button onClick={fetchWikiPage} className='absolute right-1 top-1/2 -translate-y-1/2 p-4 rounded-full bg-[#f8f5f2a8] hover:bg-[#95dfdf]'>
            <SearchIcon></SearchIcon>
        </button>
        {!isCollapsed &&  <div className='absolute top-20 p-4 bg-[#f8f5f2a8] text-[#222525] rounded-xl w-full flex flex-col gap-2 overflow-scroll '>
            {queryResultData && queryResultData.map((page, id) => {
                return (<div key={id} className='hover:bg-[#95dfdf] rounded-sm flex flex-col' onClick={(e)=>handleQueryClick(e,page)} >
                    {page.thumbnail && <img src={page.thumbnail.source} alt={page.title} />} 
                    <div className='flex flex-row'>
                        <p>{page.title}</p>
                        {page.terms && page.terms.description && <p>{page.terms.description[0]}</p>}
                    </div>
                </div>)
            })}
        </div>}
    </div>
  )
}
