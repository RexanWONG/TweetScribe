import React from 'react'
import { Rings } from 'react-loader-spinner'

const Loader = () => {
  return (
    <div className='flex flex-col items-center justify-center mt-64'>
        <Rings
            height="400"
            width="200"
            color="#2596be"
            radius="10"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel="rings-loading"
        />
        <h1 className='text-white text-2xl font-light'>Hold on!  Your request is being processed...</h1>
    </div>
  )
}

export default Loader