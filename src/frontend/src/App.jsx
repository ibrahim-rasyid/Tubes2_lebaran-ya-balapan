import { useState } from 'react'
import Input from './components/Input'

function App() {
  const [isUsingBFS, setIsUsingBFS] = useState(true)

  function handleModeChange(){
    setIsUsingBFS(!isUsingBFS)
  }

  return (
    <>
      <Input onModeChange={handleModeChange}/>
    </>
  )
}

export default App
