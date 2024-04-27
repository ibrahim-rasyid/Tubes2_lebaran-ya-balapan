import { useState } from 'react'

const styling = `
  input.rangeSlider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    border: 2px solid black;
    border-radius: 50%;
    cursor: pointer;
    background: #fff;
  }
`

export default function Slider({onMaxResultChange}) {
  const [rangeValue, setRangeValue] = useState(1)

  function handleMaxResultChange(e){
    setRangeValue(+e.target.value)
    onMaxResultChange(e)
  }

  return (
    <>
      <style>{styling}</style>
      <div className="w-[350px] flex flex-col items-center mb-7">
        <p className='mb-5'>Max result to be displayed: {rangeValue} {rangeValue === 0? '(Display all)':''}</p>
        <label htmlFor="range-slider" className="sr-only">
          Default range
        </label>
        <input
          id="range-slider"
          type="range"
          min={0}
          max={200}
          value={rangeValue}
          onChange={handleMaxResultChange}
          className="rangeSlider h-2 w-full cursor-pointer appearance-none rounded-lg border-2 border-black bg-white"
        />
      </div>
    </>
  )
}
