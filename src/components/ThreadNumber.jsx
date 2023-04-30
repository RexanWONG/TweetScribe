import React from 'react'

const ThreadNumber = ({numOfTweetsInThread, handleInputChange}) => {
  return (
    <div className='w-full'>
        <h1 className='text-left text-2xl text-white font-thin'>🐥 <span className='font-bold'>Tweets - </span>How many tweets would you like to have in the thread?</h1>
                        <div className="mt-5 w-full max-w-[850px]">
                          <input 
                            type="range"
                            min="2"
                            max="14"
                            step="1"
                            name="numOfTweetsInThread"
                            value={numOfTweetsInThread}
                            onChange={handleInputChange}
                            className="text-[20px] font-thin bg-black rounded-lg text-white w-full h-12 outline-none" 
                          />
                        </div>
    </div>
  )
}

export default ThreadNumber