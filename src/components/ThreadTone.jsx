import React from 'react'

const ThreadTone = ({tone, handleInputChange}) => {
  return (

    <div className='flex flex-col items-start justify-start mt-12'>
        <h1 className='text-left text-2xl text-white font-thin'>📣 <span className='font-bold'>Tone - </span> How you want your thread to feel like</h1>
        <div className="border-2 rounded-lg p-4 mt-5 w-full max-w-[850px]">
        <input 
            name="tone"
            value={tone}
            onChange={handleInputChange}
            className="text-[20px] font-thin bg-black rounded-lg text-white w-full h-16 p-2 outline-none" 
            placeholder="super entertaining and informative"
        />
        </div>
    </div>
  )
}

export default ThreadTone