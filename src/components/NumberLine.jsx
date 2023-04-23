import React from 'react'

const NumberLine = ({number}) => {
  return (
    <div className='flex flex-row gap-14 ml-4 font-thin'>
                          {number == 2 ? (
                            <p className='text-white font-bold  '>2</p>
                          ) : (
                            <p className='text-gray-400'>2</p>
                          )}

                          {number == 3 ? (
                            <p className='text-white font-bold'>3</p>
                          ) : (
                            <p className='text-gray-400'>3</p>
                          )}

                          {number == 4 ? (
                            <p className='text-white font-bold'>4</p>
                          ) : (
                            <p className='text-gray-400'>4</p>
                          )}

                          {number == 5 ? (
                            <p className='text-white font-bold'>5</p>
                          ) : (
                            <p className='text-gray-400'>5</p>
                          )}

                          {number == 6 ? (
                            <p className='text-white font-bold  '>6</p>
                          ) : (
                            <p className='text-gray-400'>6</p>
                          )}

                          {number == 7 ? (
                            <p className='text-white font-bold'>7</p>
                          ) : (
                            <p className='text-gray-400'>7</p>
                          )}

                          {number == 8 ? (
                            <p className='text-white font-bold'>8</p>
                          ) : (
                            <p className='text-gray-400'>8</p>
                          )}

                          {number == 9 ? (
                            <p className='text-white font-bold'>9</p>
                          ) : (
                            <p className='text-gray-400'>9</p>
                          )}

                          {number == 10 ? (
                            <p className='text-white font-bold'>10</p>
                          ) : (
                            <p className='text-gray-400'>10</p>
                          )}

                          {number == 11 ? (
                            <p className='text-white font-bold'>11</p>
                          ) : (
                            <p className='text-gray-400'>11</p>
                          )}

                          {number == 12 ? (
                            <p className='text-white font-bold'>12</p>
                          ) : (
                            <p className='text-gray-400'>12</p>
                          )}

                          {number == 13 ? (
                              <p className='text-white font-bold'>13</p>
                            ) : (
                              <p className='text-gray-400'>13</p>
                          )}

                          {number == 14 ? (
                            <p className='text-white font-bold'>14</p>
                          ) : (
                            <p className='text-gray-400'>14</p>
                          )}  
                        </div>
  )
}

export default NumberLine