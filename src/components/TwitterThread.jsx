import React from 'react'

const TwitterThread = ({headline, twitterThread}) => {
  return (
    <div className='flex flex-row items-center justify-center gap-32 mt-64'>
        <div className='flex flex-col relative bottom-48 mb-10 ml-32'>
            <h1 className='max-w-[570px] text-8xl font-black bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-text'>
                <span className='text-white'>🧵</span>
                    {headline}
            </h1>
            <p className='text-white text-2xl font-thin max-w-[400px] mt-10'>
                🤩 Here's your potential twitter thread.  See if you like it or not.  
                You can always edit the individual threads to your liking.
            </p>

            <p className='text-white text-2xl font-thin max-w-[400px] mt-10'>
                😡 Dislike the thread?  You can always reclick the <span className='bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-text'>'Start Threadding'</span> 
                button to generate a new version of the thread that you want!
            </p>
        </div>
        <h2 className='text-white'>
            {twitterThread}
         </h2>
    </div>
  )
}

export default TwitterThread