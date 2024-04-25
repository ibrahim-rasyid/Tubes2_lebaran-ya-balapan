import React from 'react'
import ResultBox from './ResultBox'
// import DAGGraph from './DAGGraph'

export default function Result({resultData}) {
  const resultCount = resultData.result.length

    const Multiresults = resultData.result.map((path,i) => (
      <div className='flex flex-col w-[370px] h-full border-black border-2 rounded-md hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] bg-white' key={i}>
        <ResultBox path={path} />
      </div>
  ))
  return (
    <div className='mt-20 lg:mt-0'>
      <p className='text-center lg:py-5 text-xl ' >Found <strong>{resultCount} {resultCount === 1 ? ' path ' : ' paths '}</strong>
       from "{resultData.result[0].Title}" to "{resultData.result[resultCount-1].Title}" in <strong>{resultData.time} seconds!</strong></p>
        <p className='text-center text-2xl font-bold m-5 '>Path Found</p>
        <div className='mx-auto justify-center flex flex-row flex-wrap gap-10'>
          {Multiresults}
        </div>
    </div>
  )
}
