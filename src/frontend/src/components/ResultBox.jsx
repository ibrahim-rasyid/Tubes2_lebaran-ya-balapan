import React from 'react'

export default function ResultBox({path}) {

  return (
    path.map((item, i) => (
        <div key={i} className='w-full h-full flex flex-row px-6 py-1 items-center cursor-pointer overflow-hidden border-black border-[0.5px] '>
            {/* <img src={item.thumbnailUrl} className='w-[60px] h-[60px] mr-[12px] rounded-md border-black border-2'/> */}
            <div className='flex flex-col justify-center h-[70px] flex-[1]'>
                <p className='text-lg font-medium'>{item.Title}</p>
                {/* <p className='max-h-[46px] line-clamp-4'>{item.description}</p> */}
            </div>
        </div>
    ))
  )
}
