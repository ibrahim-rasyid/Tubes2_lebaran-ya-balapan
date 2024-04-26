import React from 'react'
import ResultBox from './ResultBox'
import Graph from './Graph'
import Graph2 from './Graph2'

export default function Result({resultData}) {
  const {accessed, n_step, steps, time} = resultData
  const resultCount = 1 // single result

  return (
    <div className='mt-20 lg:mt-0 py-3'>
      <p className='text-center lg:py-5 text-xl ' >Found <strong>{resultCount} {resultCount === 1 ? ' path ' : ' paths '}</strong>
       from "{steps[0].Title}" to "{steps[steps.length-1].Title}" with <strong>{accessed} accessed nodes </strong>
       and <strong>{n_step}</strong> {n_step === 1 ? 'step' : 'steps'} in <strong>{(time*1000).toFixed(2)} miliseconds!</strong></p>
        <p className='text-center text-2xl font-bold m-5 '>Path Found</p>
        <div className='mx-auto justify-center flex flex-row flex-wrap gap-10'>
          {resultCount > 1 && steps.map((path,i) => (
            <div className='flex flex-col w-[370px] h-full border-black border-2 rounded-md hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] bg-white' key={i}>
                <ResultBox path={steps} />
              </div>
          ))}
          {resultCount === 1 && <div className='flex flex-col w-[370px] h-full border-black border-2 rounded-md hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] bg-white'>
            <ResultBox path={steps} />
          </div>}
        </div>
        {/* <Graph2 paths={steps} /> */}
        {/* <Graph paths={steps} /> */}
    </div>
  )
}
