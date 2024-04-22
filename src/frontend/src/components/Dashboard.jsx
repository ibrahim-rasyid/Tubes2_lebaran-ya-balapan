import React, {useState, useEffect } from 'react'
import { styled } from '@mui/material/styles';
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

    useEffect(() => {
      onModeChange(mode);
    }, [mode]);

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
