import React from 'react'

const ThreadHashtagLevel = ({ hashtagLevel, handleInputChange }) => {
  return (
    <div className='flex flex-col items-start justify-start mt-16'>
        <h1 className='text-left text-2xl text-white font-thin'>#️⃣ <span className='font-bold'>Hashtag level - </span>Relative amount of hashtags to include in the thread</h1>
        <div className="mt-5 w-full max-w-[850px]">
        <input 
            type="range"
            min="0"
            max="1"
            step="0.5"
            name="hashtagLevel"
            value={hashtagLevel}
            onChange={handleInputChange}
            className="text-[20px] font-thin bg-black rounded-lg text-white w-full h-12 outline-none" 
        />
        </div>
        <div className='flex flex-row gap-60'>
        <p className='text-gray-400 font-thin'>No hashtags!</p>
        <p className='text-gray-400 font-thin'>#a-bit-of-hashtags!</p>
        <p className='text-gray-400 font-thin'>#a-lot-of-hashtags!</p>
        </div>
    </div>
  )
}

export default ThreadHashtagLevel