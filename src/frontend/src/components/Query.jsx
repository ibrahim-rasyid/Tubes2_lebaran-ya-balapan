import React, {useState } from 'react'
import axios from "axios"
import nothumbnail from '../assets/nothumbnail.png'

export default function Query({id, onPageInput, pageInput, onQueryResultChange, queryResultData, placeholder}) {
    const [isCollapsed, setIsCollapsed] = useState(true)
    
    const endpoint = 'https://en.wikipedia.org/w/api.php?' // for search engine purposes
    const params = {
      action: "query",
      format: "json",
      generator: "prefixsearch",
      prop: "info|pageprops|pageimages|pageterms",
      ppprop: "displaytitle",
      piprop: "thumbnail",
      pithumbsize: 50,
      pilimit: 30,
      wbptterms: "description",
      gpsnamespace: 0,
      gpslimit: 6,
      inprop: "url",
      origin: "*"
    }

    async function fetchWikiPage(e){
      params.gpssearch = e.target.value
      try {
        const wikiresponse = await axios.get(endpoint, { params })
        if (wikiresponse.error){
            throw new Error("Fail fetching wikipedia page");
        }
        onQueryResultChange(Object.values(wikiresponse.data.query.pages))
        setIsCollapsed(false)
      } catch (error) {
        console.log("Unexpected error occured")
      }
    }

    function handlePageSelect(e,page){
        onPageInput({title:page.title, url:page.fullurl})
        setIsCollapsed(true)
    }

    function handleQueryChange(e){
      onPageInput({title:e.target.value, url:''})
      fetchWikiPage(e)
    }

  return (
    <div className='relative'>
        <div className='flex items-center w-full'>
            <input
                id={id}
                type="text"
                placeholder={placeholder}
                className={`border-black border-2  w-full p-2.5 ${isCollapsed? 'rounded-md' : 'rounded-t-md'} bg-white focus:outline-none`}
                value={pageInput.title}
                onChange={handleQueryChange}
            />
        </div>
        {pageInput!= "" && !isCollapsed &&  <div className='absolute left-0 right-0 p-4 max-h-60 bg-white text-[#222525] rounded-b-md w-full flex flex-col gap-2 overflow-y-scroll scroll-smooth border-l-black border-b-black border-r-black border-2'>
            {queryResultData && queryResultData.map((page,i) => {
                return (
                <div key={i}
                    className=' flex flex-row px-2 py-[37px] items-center cursor-pointer overflow-hidden '
                    onClick={(e)=>handlePageSelect(e,page)}>
                  {page.thumbnail && <img src={page.thumbnail.source} className='w-[40px] h-[40px] mr-[12px] rounded-md border-black border-[0.5px]'/>}
                  {!page.thumbnail && <img src={nothumbnail} className='w-[40px] h-[40px] mr-[12px] rounded-md border-black border-[0.5px]'/>}
                  <div className='flex flex-col justify-center flex-[1]'>
                      <p className='text-md font-medium whitespace-nowrap'>{page.title}</p>
                      {page.terms && page.terms.description && <p className='text-sm'>{page.terms.description[0]}</p>}
                  </div>
                </div>)
            })}
        </div>}
    </div>
  )
}
