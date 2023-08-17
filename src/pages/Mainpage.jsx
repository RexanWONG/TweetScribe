import { useState, useEffect } from 'react'
import { EmojiLevel, Loader, NumberLine, ThreadHashtagLevel, ThreadNumber, ThreadTone, TwitterThread, Payment } from '../components'
import { authentication } from '../.././firebase/firebaseConfig'
import { TwitterAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence, inMemoryPersistence } from 'firebase/auth'
import { getRandomTextSample, generateStatementsFromText, generateThreadFromStatements, generateInstantThreadFromText } from '../utils'
import { RxMagicWand } from 'react-icons/rx'

const Mainpage = () => {
  const [signedInWithTwitter, setSignedInWithTwitter] = useState(false)
  const [twitterUsername, setTwitterUsername] = useState("")
  const [twitterHandle, setTwitterHandle] = useState("")
  const [twitterPfp, setTwitterPfp] = useState("")

  const [wordCount, setWordCount] = useState(0);
  const [inputValue, setInputValue] = useState({
    inputText: "",
    numOfTweetsInThread: 8,
    tone: "",
    emojiLevel: 0.5,
    hashtagLevel: 0.5,
  });

  const [isStatementOrientated, setIsStatementOrientated] = useState(false)
  const [isInstantThread, setIsInstantThread] = useState(false)

  const [rawGeneratedStatements, setRawGeneratedStatements] = useState("")
  const [requestedGenerateStatements, setRequestedGeneratedStatements] = useState(false)
  const [generatedStatements, setGeneratedStatements] = useState("")
  const [statementsGenerated, setStatementsGenerated] = useState(false) 

  const [requestedGenerateTwitterThread, setRequestedGenerateTwitterThread] = useState(false)
  const [twitterThread, setTwitterThread] = useState("")
  const [twitterThreadGenerated, setTwitterThreadGenerated] = useState(false)

  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showPayment, setShowPayment] = useState(false)

  const generateStatements = async () => {
    try {
      setRequestedGeneratedStatements(true);
      const target = document.getElementById('scroll-target');
      target.scrollIntoView({ behavior: 'smooth' });
  
      const statements = await generateStatementsFromText(wordCount, inputValue.inputText);
  
      setRawGeneratedStatements(statements.choices[0].text.trim());
      setGeneratedStatements(
        (statements.choices[0].text.trim().split('\n')).map((line, index) => <p key={index}>{line}</p>)
      );
  
      setStatementsGenerated(true);
      setRequestedGeneratedStatements(false);

    } catch (error) {
      alert(error);
    }
  };   

  const generateThreadWithStatements = async () => {
    try {
      setRequestedGenerateTwitterThread(true)
      const target = document.getElementById('scroll-target');
      target.scrollIntoView({behavior: 'smooth'});

      const twitterThread = await generateThreadFromStatements(
        inputValue.emojiLevel,
        inputValue.hashtagLevel,
        rawGeneratedStatements,
        inputValue.tone,
        inputValue.numOfTweetsInThread
      )

      setTwitterThread(((twitterThread.choices[0].text.trim()).split("\n")).map((line, index) => (
        <div key={index} className="border-2 border-blue-500 rounded-lg p-10 my-4 max-w-[600px]">
          <p className="font-bold">Tweet {index}:</p>
          <p>{line}</p>
        </div>
      )))

      setTwitterThreadGenerated(true)
      setRequestedGenerateTwitterThread(false)

    } catch (error) {
      alert(error)
    }
  }

  const generateInstantThread = async () => {
    try {
      setRequestedGenerateTwitterThread(true)
      const target = document.getElementById('scroll-target');
      target.scrollIntoView({behavior: 'smooth'});

      const twitterThread = await generateInstantThreadFromText(
        inputValue.inputText,
        inputValue.emojiLevel,
        inputValue.hashtagLevel,
        inputValue.tone,
        inputValue.numOfTweetsInThread
      )

      setTwitterThread(((twitterThread.choices[0].text.trim()).split("\n")).map((line, index) => (
        <div key={index} className="border-2 border-blue-500 rounded-lg p-10 my-4 max-w-[600px]">
          <p className="font-bold">Tweet {index}:</p>
          <p>{line}</p>
        </div>
      )))

      setTwitterThreadGenerated(true)
      setRequestedGenerateTwitterThread(false)

    } catch (error) {
      alert(error)
    }
  }

  const signInWithTwitter = () => {
    const provider = new TwitterAuthProvider();

    setPersistence(authentication, browserLocalPersistence)
      .then(() => {
        signInWithPopup(authentication, provider)
          .then((re) => {
            console.log(re);
            setSignedInWithTwitter(true);
            setTwitterUsername(re.user.displayName);
            setTwitterHandle(re.user.reloadUserInfo.screenName);
            setTwitterPfp(re.user.photoURL);

            const expirationTime = 24 * 60 * 60 * 1000; 
            setTimeout(() => {
              setPersistence(authentication, inMemoryPersistence).then(() => {
                authentication.signOut();
              });
            }, expirationTime);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((error) => {
        alert(error);
      });
  };

  const handleInputChange = (event) => {
    setInputValue(prevFormData => ({ ...prevFormData, [event.target.name]: event.target.value }));
  }

  const handleRandomTextSample = () => {
    const randomTextSample = getRandomTextSample(inputValue.inputText)
    setInputValue(prevFormData => ({...prevFormData, inputText: randomTextSample }));
  }

  const selectProcess = (process) => {
    if (process === "statements") {
      setIsStatementOrientated(true)
      setIsInstantThread(false)
    } else if (process === "instant-thread") {
      setIsInstantThread(true)
      setIsStatementOrientated(false)
    }
  }

  const toggleUpgradeModal = () => {
    setShowUpgradeModal(!showUpgradeModal);
  };

  const showPaymentScreen = () => {
    toggleUpgradeModal()
    setShowPayment(!showPayment);
  };
  
  useEffect(() => {
    const words = inputValue.inputText.split(' ');
    let wordCount = 0;
    words.forEach((word) => {
      if (word.trim() !== '') {
        wordCount++;
      }
    });
    setWordCount(wordCount);
  }, [inputValue.inputText]);

  return (  
    <div className='font-inter bg-black min-h-screen flex'>
      <aside className="fixed w-64 h-screen flex-shrink-0 rounded-lg mt-12">
        <div className="flex flex-col h-full">
          <div className="px-5 xl:px-12 py-6 flex w-full items-center">
            <a className="text-5xl font-black bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-text" href="/">
              🐥📜
            </a>
          </div>

          <ul className="flex flex-col mx-auto font-thin space-y-5 items-start justify-center px-5 ml-7 mt-7">
            <li>
              <a className="text-2xl text-white hover:text-gray-200 hover:bg-gray-800 p-2 rounded-lg" href="/">
                🧵 App
              </a>
            </li>

            <li>
              <a className="text-2xl text-white hover:text-gray-200 hover:bg-gray-800 p-2 rounded-lg" href="https://tweet-scribe-about.vercel.app/" target="_blank" rel="noopener noreferrer">
                📜 Overview
              </a>
            </li>
            
            <li>
              <a className="text-2xl text-white hover:text-gray-200 hover:bg-gray-800 p-2 rounded-lg" href="https://github.com/RexanWONG/TweetScribe/" target="_blank" rel="noopener noreferrer">
                😼 Github
              </a>
            </li>
          </ul>

          <div className="mt-auto ml-7 mb-16 px-3">
            <ul className="flex flex-col mx-auto font-thin space-y-3 items-start justify-center px-5 mb-10">
              <li>
                <a className="text-2xl text-white hover:text-gray-200 hover:bg-gray-800 p-2 rounded-lg">
                  💼 My plan
                </a>
              </li>
              <li>
                <button onClick={toggleUpgradeModal} className="text-2xl text-white hover:text-gray-200 hover:bg-gray-800 p-2 rounded-lg">
                   🚀 Upgrade
                </button>
              </li>
            </ul>

            <div className='ml-3'>
              {signedInWithTwitter ? (
                <a href={`https://twitter.com/${twitterHandle}`} target="_blank" rel="noopener noreferrer">
                  <div className='flex flex-row'>
                    <img
                      src={twitterPfp}
                      alt="Twitter Profile Picture"
                      className="rounded-lg mr-2"
                    />
                    <div className='flex flex-col'>
                      <h1 className='text-white font-bold'>{twitterUsername}</h1>
                      <h2 className='text-gray-400 font-thin'>@{twitterHandle}</h2>
                    </div>
                  </div>
                </a>
              ) : (
                <button onClick={() => signInWithTwitter()} className="font-thin border-2 border-blue-500 rounded-lg px-3 py-2 text-white cursor-pointer hover:bg-blue-500 hover:text-black focus:outline-none shadow-lg shadow-neon transition duration-800 ease-in-out">
                  Sign in with Twitter 
                </button>
              )}
            </div>
          </div>

          {showUpgradeModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div
                className="absolute w-full h-full bg-black opacity-50"
                onClick={toggleUpgradeModal}
              ></div>
              <div className="bg-black w-3/4 h-3/4 p-6 rounded-lg shadow-lg z-20 shadow-blue-500">
                <h2 className="text-3xl text-white font-bold mb-6">Upgrade your plan</h2>

                <div className="grid grid-cols-2 gap-10">
                  <div className="bg-gray-700 p-6 rounded-lg shadow-md">
                    <h3 className="text-2xl text-white font-bold mb-4">Free</h3>
                    <ul className='text-white'>
                      <li className="mb-2">✓ Feature 1</li>
                      <li className="mb-2">✓ Feature 2</li>
                      <li className="mb-2">- Feature 3</li>
                      <li className="mb-2">- Feature 4</li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-6 rounded-lg shadow-md animate-text">
                    <h3 className="text-2xl font-bold mb-4">Pro</h3>
                    <ul>
                      <li className="mb-2">✓ Feature 1</li>
                      <li className="mb-2">✓ Feature 2</li>
                      <li className="mb-2">✓ Feature 3</li>
                      <li className="mb-2">✓ Feature 4</li>
                    </ul>
                    <div className="flex justify-end mt-6">
                      <button
                        className="bg-white text-blue-500 font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                        onClick={() => {
                          showPaymentScreen()
                          
                        }}
                      >
                        Upgrade to Pro
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showPayment && <Payment />}

        </div>
      </aside>

      <main className='flex-grow flex flex-col items-center justify-center lg:pl-80 px-8'>
        <div className='flex flex-col text-center items-center justify-center mt-16'>
          <h1 className="text-8xl font-black bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-text">TweetScribe</h1>
          <h2 className='max-w-[900px] mt-5 font-thin text-white text-[20px]'>📜 TweetScribe is an AI-powered app that extracts <span className='font-bold text-sky-300'>important</span> statements from long pieces of text and creates Twitter 🧵s about them on Twitter, saving time and increasing engagement 🚀</h2>
          <p className='text-gray-400 text-center font-thin max-w-[1000px] mt-5'>
                    We're excited to offer you a free preview of our product. 
                    We plan to release a paid version in the future, so we're giving you a chance to try it out early. 
                    Please keep in mind that there may be some bugs or issues during this preview period, so if you come across any problems, please don't hesitate to let us know. 
                    Your feedback is invaluable in helping us improve our product.
          </p>
        </div>

        <div className="border-2 border-blue-500 rounded-lg p-6 mt-12 w-full max-w-[850px]">
          <textarea 
            name="inputText" 
            value={inputValue.inputText}
            onChange={handleInputChange}
            className="text-[20px] font-thin bg-black rounded-lg text-white w-full h-80 p-4 outline-none" 
            placeholder="📋 Paste your text here, we'll get the main points right for you.  Max 8000 words :)">
          </textarea> 
        </div>
        
        {!showUpgradeModal ? (
          <div className='relative left-80 flex flex-row mt-2'>na
            <button onClick={handleRandomTextSample}>
              <RxMagicWand 
                className='text-white hover:animate-pulse'
                size={30}
              />
            </button>

        
            <div className="flex items-center justify-end p-4 z-10">
                <span className="text-white font-bold text-lg mr-2">Word count:</span>
                {wordCount <= 8000 ? (
                  <span className="text-white font-bold text-lg">{wordCount}/8000</span>
                ) : (
                  <span className="text-red-400 font-bold text-lg">{wordCount}/8000</span>
                )}
            </div>
          </div>
        ) : (
          <div className='relative left-80 flex flex-row mt-2 hidden'>
              <button onClick={handleRandomTextSample}>
                <RxMagicWand 
                  className='text-white hover:animate-pulse'
                  size={30}
                />
              </button>

            
            <div className="flex items-center justify-end p-4 z-10">
                <span className="text-white font-bold text-lg mr-2">Word count:</span>
                {wordCount <= 8000 ? (
                  <span className="text-white font-bold text-lg">{wordCount}/8000</span>
                ) : (
                  <span className="text-red-400 font-bold text-lg">{wordCount}/8000</span>
                )}
            </div>
          </div>
        )}

        <div className='flex flex-col items-center justify-center mt-10'>
          <h1 className='text-4xl text-white font-black'>How would you like to go about it?</h1>
          <h2 className='text-2xl text-white font-thin mt-2'>Select the process to generate the end product</h2>
          <div className='flex flex-row items-center justify-center gap-4'>

            {!isStatementOrientated ? (
              <div className='rounded-lg hover:bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-1 mt-10 max-w-[450px] animate-text'>
                <div className='flex flex-col bg-black p-4'>
                  <button onClick={() => selectProcess('statements')}>
                    <h1 className='text-left text-3xl text-white font-bold'>📜 Statement orientated</h1>
                    <h2 className='text-left text-white font-thin mt-1'>Generate important statements to summarize the text first.  You can adjust the statements to your liking. After, a Twitter thread will be written mostly based on the content of those statements</h2>
                  </button>
                </div>
              </div>
            ) : (
              <div className='rounded-lg bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-1 mt-10 max-w-[450px] animate-text'>
                <div className='flex flex-col p-4'>
                  <button>
                    <h1 className='text-left text-3xl text-black font-bold'>📜 Statement orientated</h1>
                    <h2 className='text-left text-black mt-1'>Generate important statements to summarize the text first.  You can adjust the statements to your liking. After, a Twitter thread will be written mostly based on the content of those statements</h2>
                  </button>
                </div>
              </div>
            )}
  
            {!isInstantThread ? (
              <div className='rounded-lg hover:bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-1 mt-10 max-w-[450px] animate-text'>
                <div className='flex flex-col bg-black p-4'>
                  <button onClick={() => selectProcess('instant-thread')}>
                    <h1 className='text-left text-3xl text-white font-bold'>🚀 Instant thread</h1>
                    <h2 className='text-left text-white font-thin mt-1'>Instantly writes a twitter thread based on the text provided.  Usally lower accuracy compared to the statement orientated process</h2>
                  </button>
                </div>
              </div>
            ) : (
              <div className='rounded-lg bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-1 mt-10 max-w-[450px] animate-text'>
                <div className='flex flex-col p-4'>
                  <button>
                    <h1 className='text-left text-3xl text-black font-bold'>🚀 Instant thread</h1>
                    <h2 className='text-left text-black mt-1'>Instantly writes a twitter thread based on the text provided.  Usally lower accuracy compared to the statement orientated process</h2>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className='mt-16'>
          {isStatementOrientated ? (
            !requestedGenerateStatements ? (
              statementsGenerated ? (
                <div className='mt-64 flex flex-col items-center justify-center'>
                  <h1 className='text-6xl font-black bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-text py-2'><span className='text-white'>🚀</span> Summarized. Simplified. Succeeded!</h1>
                  <div className='flex flex-row mt-16 gap-16'>
                    <div className='flex flex-col'>
                      <h1 className='text-white text-4xl font-black mb-5'>Your statements</h1>
                      <h2 className='text-white text-left font-thin max-w-[1000px]'>{generatedStatements}</h2>

                      <div className='flex flex-col mt-16'>
                        <h1 className='text-4xl text-white font-black'>Configure your upcoming thread</h1>

                      <ThreadTone tone={inputValue.tone} handleInputChange={handleInputChange}/>

                        <div className='flex flex-col items-start justify-start mt-16'>
                          <ThreadNumber numOfTweetsInThread={inputValue.numOfTweetsInThread} handleInputChange={handleInputChange}/>
                          <NumberLine number={inputValue.numOfTweetsInThread}/>
                        </div>

                        <EmojiLevel emojiLevel={inputValue.emojiLevel} handleInputChange={handleInputChange}/>
                        <ThreadHashtagLevel hashtagLevel={inputValue.hashtagLevel} handleInputChange={handleInputChange} />

                      </div>

                      <button id="scroll-button" onClick={generateThreadWithStatements} className="font-bold text-3xl rounded-lg px-8 py-4 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 animate-text mt-10 mb-16 hover:shadow-lg hover:from-blue-500 hover:to-purple-600 hover:text-white">
                        Start writing the thread!
                      </button>
                    </div>
                  </div>

      
                  {!requestedGenerateTwitterThread ? (
                    !twitterThreadGenerated? (
                      <div />
                    ) : (
                      <TwitterThread 
                        headline={'Your statements have been threadded!'} 
                        twitterThread={twitterThread}
                      />
                    )
                  ) : (
                    <Loader />
                  )}
                </div>
              ) : (
                <div className='flex flex-col items-center justify-center'>
                  {signedInWithTwitter ? (
                    wordCount <= 8000 ? (
                      <button id="scroll-button" onClick={generateStatements} className="font-bold text-3xl rounded-lg px-8 py-4 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 animate-text mt-10 mb-16 hover:shadow-lg hover:from-blue-500 hover:to-purple-600 hover:text-white">
                        Generate statements!
                      </button>

                    ) : (
                      <div className='flex flex-col items-center justify-center'>
                        <p className='text-white text-center max-w-[800px] font-thin'>Too many words</p>
                        <button id="scroll-button" className="font-bold text-3xl rounded-lg px-8 py-4 bg-gray-400 animate-text mt-10 mb-16 hover:shadow-lg hover:animate-pulse">
                          Generate statements!
                        </button>
                        
                      </div>
                      
                    )
                  ) : (
                    <div className='flex flex-col items-center justify-center'>
                      <p className='text-white text-center max-w-[800px] font-thin'>You need to have a Twitter account in order to use the product.  Click 'sign in with Twitter' at the top right corner of the navbar to sign in to your Twitter account</p>
                      <button id="scroll-button" className="font-bold text-3xl rounded-lg px-8 py-4 bg-gray-400 animate-text mt-10 mb-16 hover:animate-pulse">
                        Generate statements!
                      </button>

                    </div>
                  )}
                </div>
              )
            ) : (
              <Loader />
      
            )
          ) : (
            isInstantThread ? (
              <div className='flex flex-col items-center justify-center'>
                <div className='flex flex-row gap-16'>
                  <div className='flex flex-col'>
                    <div className='flex flex-col'>
                      <h1 className='text-4xl text-white font-black'>Configure your upcoming thread</h1>

                    <ThreadTone tone={inputValue.tone} handleInputChange={handleInputChange}/>

                      <div className='flex flex-col items-start justify-start mt-16'>
                        <ThreadNumber numOfTweetsInThread={inputValue.numOfTweetsInThread} handleInputChange={handleInputChange}/>
                        <NumberLine number={inputValue.numOfTweetsInThread}/>
                      </div>

                      <EmojiLevel emojiLevel={inputValue.emojiLevel} handleInputChange={handleInputChange}/>
                      <ThreadHashtagLevel hashtagLevel={inputValue.hashtagLevel} handleInputChange={handleInputChange} />
                    </div>

                    <div className='mt-16'>
                      {signedInWithTwitter ? (
                        wordCount <= 8000 ? (
                          <div className='flex items-center justify-center'>
                            <button id="scroll-button" onClick={generateInstantThread} className="font-bold text-3xl rounded-lg px-8 py-4 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 animate-text mt-10 mb-16 hover:shadow-lg hover:from-blue-500 hover:to-purple-600 hover:text-white">
                              Generate Twitter Thread!!
                            </button>
                          </div>
                        ) : (
                          <div className='flex flex-col items-center justify-center'>
                            <p className='text-white text-center max-w-[800px] font-thin'>Too many words</p>
                            <button id="scroll-button" className="font-bold text-3xl rounded-lg px-8 py-4 bg-gray-400 animate-text mt-10 mb-16 hover:shadow-lg hover:animate-pulse">
                              Generate Twitter Thread!
                            </button>
                          </div>
                          
                        )

                      ) : (
                        <div className='flex flex-col items-center justify-center'>
                          <p className='text-white text-center max-w-[800px] font-thin'>You need to have a Twitter account in order to use the product.  Click 'sign in with Twitter' at the top right corner of the navbar to sign in to your Twitter account</p>
                          <button id="scroll-button" className="font-bold text-3xl rounded-lg px-8 py-4 bg-gray-400 animate-text mt-10 mb-16 hover:animate-pulse">
                            Generate Twitter Thread!
                          </button>

                        </div>
                      )}
                    </div>
                  </div>
                </div>


              {!requestedGenerateTwitterThread ? (
                !twitterThreadGenerated? (
                  <div />
                ) : (
                  <TwitterThread 
                    headline={'Check out your Twitter Thread!'} 
                    twitterThread={twitterThread}
                  />
                )
              ) : (
                <Loader />
              )}
            </div>
            ) : (
              <h1>U want nothing???</h1>
            )
          )}

        </div>
        <div id="scroll-target" className="mt-64 mb-64">beep beep.  boop beep.</div>
      </main>
    </div>
  )
}

export default Mainpage
