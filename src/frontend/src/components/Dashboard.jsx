import React, {useState, useEffect } from 'react'
import axios from "axios"
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Query from './Query';

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 15,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(9px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(12px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
    boxSizing: 'border-box',
  },
}));

export default function Dashboard({onModeChange, onResultChange}) {
    const [startPageInput, setStartPageInput] = useState('')
    const [goalPageInput, setGoalPageInput] = useState('')
    const [queryResultData, setQueryResultData] = useState([])
    const [mode, setMode] = useState(true);

  
    const [isCollapsed, setIsCollapsed] = useState(true)
    const [selectedPage, setSelectedPage] = useState({})

    useEffect(() => {
      onModeChange(mode);
    }, [mode]);

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
      params.gpssearch = startPageInput
      try {
        const wikiresponse = await axios.get(endpoint, { params })
        if (wikiresponse.error){
          throw new Error("Fail fetching wikipedia page");
        }
        setQueryResultData(Object.values(wikiresponse.data.query.pages))
        setIsCollapsed(false)
        return Object.values(wikiresponse.data.query.pages)
      } catch (error) {
        console.log("Unexpected error occured")
      }
    }
    
    async function handleSubmit(e){
      e.preventDefault()
      
      if (startPageInput && startPageInput != "" && goalPageInput && goalPageInput != ""){
        // TO DO : Lift state up
        const response = await fetch('http://localhost:8080/bfs', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({startPage: startPageInput, goalPage: goalPageInput, startUrl: queryResultData[0].fullurl, goalUrl: ''})
        })
        
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        
        const content = await response.json()
        onResultChange(content)
      }
    }

  function handleQueryClick(e,page){
    console.log(page)
    setStartPageInput(page.title)
    setIsCollapsed(true)
    setSelectedPage(page)
  }
    
  console.log(startPageInput)
  console.log(goalPageInput)
  // function QueryResult({ queryResultData }) {
  //   // const [isCollapsed, setIsCollapsed] = useState(true)
  //   const [selectedPage, setSelectedPage] = useState(null)
  //   const [selectedPageID, setSelectedPageID] = useState(null)
  //   return (
  //     <Box sx={{ flexGrow: 1 }}>
  //       <Grid container spacing={2}>
  //         <Grid item xs={6}>
  //           <Item>xs=6</Item>
  //         </Grid>
  //         <Grid item xs>
  //           <Item>xs</Item>
  //         </Grid>
  //       </Grid>
  //     </Box>
  //   )
  // }

  // console.log(selectedPage)
  return (
    <div>
      <form className='w-full relative grid grid-rows-2 gap-40 '>
        <div className='relative grid grid-cols-2 gap-8' >
          <Query onPageInput={setStartPageInput} pageInput={startPageInput} onQueryResultChange={setQueryResultData} queryResultData={queryResultData} placeholder="Start page"/>
          <Query onPageInput={setGoalPageInput} pageInput={goalPageInput} onQueryResultChange={setQueryResultData} queryResultData={queryResultData} placeholder="Goal page"/>
        </div>

        <div className='relative'>
            <Stack direction="row" spacing={1} alignItems="center" >
              <Typography>BFS</Typography>
              <AntSwitch defaultChecked inputProps={{ 'aria-label': 'ant design' }} />
              <Typography>IDS</Typography>
            </Stack>
            <button type='button' onClick={(e) => handleSubmit(e)}>Search</button>
        </div>
      </form>
    </div>
  )
}
