import React from 'react'

export default function ResultBox({path}) {

  return (
    path.map((item, i) => (
        <div key={i} className='w-full h-full flex flex-row px-6 py-1 items-center cursor-pointer overflow-hidden border-black border-[0.5px] '>
            <div className='flex flex-col justify-center h-[70px] flex-[1]'>
                <p className='text-lg font-medium'>{item.title}</p>
            </div>
        </div>
    ))
  )
}
