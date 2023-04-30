import React from 'react'

const EmojiLevel = ({emojiLevel, handleInputChange}) => {
  return (
    <div className='flex flex-col items-start justify-start mt-16'>
        <h1 className='text-left text-2xl text-white font-thin'>🙂 <span className='font-bold'>Emoji level - </span>Relative amount of emojis to include in the thread</h1>
            <div className="mt-5 w-full max-w-[850px]">
                <input 
                    type="range"
                    min="0"
                    max="1"
                    step="0.5"
                    name="emojiLevel"
                    value={emojiLevel}
                    onChange={handleInputChange}
                     className="text-[20px] font-thin bg-black rounded-lg text-white w-full h-12 outline-none" 
                />
            </div>
            <div className='flex flex-row gap-64'>
                <p className='text-gray-400 font-thin'>No emojis at all!</p>
                 <p className='text-gray-400 font-thin'>Some emojis!</p>
                <p className='text-gray-400 font-thin'>A lot of emojis!</p>
             </div>
        </div>
  )
}

export default EmojiLevel