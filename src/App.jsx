import { useState, useEffect } from 'react'
import { EmojiLevel, Loader, NumberLine, ThreadHashtagLevel, ThreadNumber, ThreadTone, TwitterThread } from './components'
import { authentication } from '../firebase/firebaseConfig'
import { TwitterAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence, inMemoryPersistence } from 'firebase/auth'
import './App.css'

const App = () => {
  const [signedInWithTwitter, setSignedInWithTwitter] = useState(false)
  const [twitterUsername, setTwitterUsername] = useState("")
  const [twitterHandle, setTwitterHandle] = useState("")
  const [twitterPfp, setTwitterPfp] = useState("")

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

  const [emojiLevelInWords, setEmojiLevelInWords] = useState("")
  const [hashtagLevelInWords, setHashtagLevelInWords] = useState("")

  const API_KEY = import.meta.env.VITE_OPENAI_API_KEY

  const generateStatements = async () => {
    try {
      console.log("Calling the OpenAI API");

      if (wordCount <= 2000 && wordCount >= 100) {
        const APIBody = {
          "model": "text-davinci-003",
          "prompt": `You are my writing assistant.  You are going to generate 8 important statements from the following 
          text that I will give you.  The statements should be very clear so that even without reading the 
          entire text, the person reading the statements will understand the ideas of the entire text.  Make the statements informative and clear.  
          Also, in the middle of each statement, 
          seperate them with a new line programatically (\n).  So without further ado, here is the text that I will give you : 
          ${inputValue.inputText}`,
  
          "temperature": 1,
          "max_tokens": 400,
          "top_p": 1.0,
          "frequency_penalty": 0.0,
          "presence_penalty": 0.0
        }
  
        setRequestedGeneratedStatements(true)
        const target = document.getElementById('scroll-target');
        target.scrollIntoView({behavior: 'smooth'});
  
  
        await fetch("https://api.openai.com/v1/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + API_KEY
          }, 
          body: JSON.stringify(APIBody)
        }).then((data) => {
          return data.json();
        }).then((data) => {
          console.log(data)
          setRawGeneratedStatements(data.choices[0].text.trim())
          setGeneratedStatements(((data.choices[0].text.trim()).split("\n")).map((line, index) => (
            <p key={index}>{line}</p>
          )))
          setStatementsGenerated(true)
          setRequestedGeneratedStatements(false)
        })

      } else if (wordCount > 2000) {
        const inputChunks = splitTextByPercentage(inputValue.inputText, 0.3);
        const allImportantStatements = [];

        setRequestedGeneratedStatements(true);
        const target = document.getElementById("scroll-target");
        target.scrollIntoView({ behavior: "smooth" });

        for (const chunk of inputChunks) {
          const prompt = `You are my writing assistant.  Write a paragraph to summarize the text. The paragraph should be very clear so that even without reading the entire text, 
          the person reading the statements will understand the ideas of the entire text.  Paragraph should be around 3 sentences  
          Make the paragraph informative and clear..    
          So without further ado, here is the text that I will give you: ${chunk}`;

          const APIBody = {
            model: "text-davinci-003",
            prompt: prompt,
            temperature: 1,
            max_tokens: 200,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
          };

          const response = await fetch("https://api.openai.com/v1/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + API_KEY,
            },
            body: JSON.stringify(APIBody),
          });

          const data = await response.json();
          console.log("Batches:", data);

          const statements = data.choices[0].text
            .trim()
            .split("\n")
            .map((line) => line.trim());
          allImportantStatements.push(...statements);
        }

        const combinedStatements = allImportantStatements.join("\n");

        const finalPrompt = `You are my writing assistant.  You are going to generate 8 important statements from the following 
        text that I will give you.  I SHOULD SEE 8 STATEMENTS!!!  The statements should be very clear so that even without reading the 
        entire text, the person reading the statements will understand the ideas of the entire text.  Make the statements informative and clear.  
        Also, in the middle of each statement, 
        seperate them with a new line programatically (\n).  So without further ado, here is the text that I will give you : ${combinedStatements}.`;

        const finalAPIBody = {
          model: "text-davinci-003",
          prompt: finalPrompt,
          temperature: 1,
          max_tokens: 400,
          top_p: 1.0,
          frequency_penalty: 0.0,
          presence_penalty: 0.0,
        };

        await fetch("https://api.openai.com/v1/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + API_KEY,
          },
          body: JSON.stringify(finalAPIBody),
        }).then((data) => {
          return data.json();
        }).then((data) => {
          console.log(data)
          setRawGeneratedStatements(data.choices[0].text.trim())
          setGeneratedStatements(((data.choices[0].text.trim()).split("\n")).map((line, index) => (
            <p key={index}>{line}</p>
          )))
          setStatementsGenerated(true)
          setRequestedGeneratedStatements(false)
        })
      } else {
        alert("Enter some more text!")
      }
      
    } catch (error) {
      alert(error)
    }
  }

  const generateThreadWithStatements = async () => {
    try {
      console.log("Calling the OpenAI API");

      if (inputValue.emojiLevel == 0) {
        setEmojiLevelInWords("Don't use emojis throughout the thread")
      } else if (inputValue.emojiLevel == 0.5) {
        setEmojiLevelInWords("Use emojis throughout the thread, but not too overwhelming and many.")
      } else if (inputValue.emojiLevel == 1) {
        setEmojiLevelInWords("Use lots of emojis throughout the thread!  A lot!  In fact, maybe AT LEAST 3 emojis per tweet!")
      }

      if (inputValue.hashtagLevel == 0) {
        setHashtagLevelInWords("Dont use hashtags throughout the thread")
      } else if (inputValue.hashtagLevel == 0.5) {
        setHashtagLevelInWords("Use some hashtags throughout the thread, but not too overwhelming and many.")
      } else if (inputValue.hashtagLevel == 1) {
        setHashtagLevelInWords("Use lots of hashtags throughout the thread")
      }

      const APIBody = {
        "model": "text-davinci-003",
        "prompt": `I will give you a list of important statements.  Here are the statements : ${rawGeneratedStatements}. 
        Please use the statements to write a well written Twitter thread.  Set the tone throughout the thread to be ${inputValue.tone}.  
        ${emojiLevelInWords}.  ${hashtagLevelInWords}. For the intro tweet of the thread, I need an engaging and concise introduction for my Twitter thread, 
        possibly including a surprising statistic, a relevant news item, or an interesting anecdote, quote, or irony to draw in my audience and set the tone for the rest of the thread. 
        I also require a strong conclusion that ties together the main points and reinforces the message, 
        potentially ending with a call to action or thought-provoking statement to encourage further engagement.
        For each tweet in a thread, put the number in front of it (eg first tweet, 1.  Second tweet, 2.).  
         Limit the num of tweets in the thread to ${inputValue.numOfTweetsInThread} tweets.`,
        
        "temperature": 1,
        "max_tokens": 3500,
        "top_p": 1.0,
        "frequency_penalty": 0.0,
        "presence_penalty": 0.0
      }

      setRequestedGenerateTwitterThread(true)
      const target = document.getElementById('scroll-target');
      target.scrollIntoView({behavior: 'smooth'});

      await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + API_KEY
        }, 
        body: JSON.stringify(APIBody)
      }).then((data) => {
        return data.json();
      }).then((data) => {
        console.log(data)
        setTwitterThread(((data.choices[0].text.trim()).split("\n")).map((line, index) => (
          <div key={index} className="border-2 border-blue-500 rounded-lg p-10 my-4 max-w-[600px]">
            <p className="font-bold">Tweet {index}:</p>
            <p>{line}</p>
          </div>
        )))
      })

      setTwitterThreadGenerated(true)
      setRequestedGenerateTwitterThread(false)
    } catch (error) {
      alert(error)
    }
  }

  const generateInstantThread = async () => {
    try {
      console.log("Calling the OpenAI API");

        const inputChunks = splitTextByPercentage(inputValue.inputText, 0.3);
        const allImportantStatements = [];

        setRequestedGenerateTwitterThread(true)
        const target = document.getElementById('scroll-target');
        target.scrollIntoView({behavior: 'smooth'});

        for (const chunk of inputChunks) {
          const prompt = `You are my writing assistant.  Write a paragraph to summarize the text. The paragraph should be very clear so that even without reading the entire text, 
          the person reading the statements will understand the ideas of the entire text.  Paragraph should be around 3 sentences  
          Make the paragraph informative and clear..    
          So without further ado, here is the text that I will give you: ${chunk}`;

          const APIBody = {
            model: "text-davinci-003",
            prompt: prompt,
            temperature: 1,
            max_tokens: 300,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
          };

          const response = await fetch("https://api.openai.com/v1/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + API_KEY,
            },
            body: JSON.stringify(APIBody),
          });

          const data = await response.json();
          console.log("Batches:", data);

          const statements = data.choices[0].text
            .trim()
            .split("\n")
            .map((line) => line.trim());
          allImportantStatements.push(...statements);
        }

        const combinedStatements = allImportantStatements.join("\n");

        const finalPrompt = `I will give you a list of important statements.  Here are the statements : ${combinedStatements}
        Please use the statements to write a well written Twitter thread.  Set the tone throughout the thread to be ${inputValue.tone}.  
        ${emojiLevelInWords}.  ${hashtagLevelInWords}. For the intro tweet of the thread, I need an engaging and concise introduction for my Twitter thread, 
        possibly including a surprising statistic, a relevant news item, or an interesting anecdote, quote, or irony to draw in my audience and set the tone for the rest of the thread. 
        I also require a strong conclusion that ties together the main points and reinforces the message, 
        potentially ending with a call to action or thought-provoking statement to encourage further engagement.
        For each tweet in a thread, put the number in front of it (eg first tweet, 1.  Second tweet, 2.).  
         Limit the num of tweets in the thread to ${inputValue.numOfTweetsInThread} tweets.`;

        const finalAPIBody = {
          model: "text-davinci-003",
          prompt: finalPrompt,
          temperature: 1,
          max_tokens: 3500,
          top_p: 1.0,
          frequency_penalty: 0.0,
          presence_penalty: 0.0,
        };

        await fetch("https://api.openai.com/v1/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + API_KEY,
          },
          body: JSON.stringify(finalAPIBody),
        }).then((data) => {
          return data.json();
        }).then((data) => {
          console.log(data)
          setTwitterThread(((data.choices[0].text.trim()).split("\n")).map((line, index) => (
            <div key={index} className="border-2 border-blue-500 rounded-lg p-10 my-4 max-w-[600px]">
              <p className="font-bold">Tweet {index}:</p>
              <p>{line}</p>
            </div>
          )))

          setTwitterThreadGenerated(true)
          setRequestedGenerateTwitterThread(false)
        })
    } catch (error) {
      alert(error)
    }
  }

  function splitTextByPercentage(text, percentage) {
    const totalLength = text.length;
    const chunkLength = Math.floor(totalLength * percentage);
    const chunks = [];
  
    let startIndex = 0;
    while (startIndex < totalLength) {
      const endIndex = startIndex + chunkLength;
      const chunk = text.slice(startIndex, endIndex);
      chunks.push(chunk);
      startIndex = endIndex;
    }
  
    return chunks;
  }

  const handleInputChange = (event) => {
    setInputValue(prevFormData => ({ ...prevFormData, [event.target.name]: event.target.value }));
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

  useEffect(() => {
    // array of words
    const words = inputValue.inputText.split(' ');

    // update word count
    let wordCount = 0;
    words.forEach((word) => {
      if (word.trim() !== '') {
        wordCount++;
      }
    });
    setWordCount(wordCount);
  }, [inputValue.inputText]);
  

  return (  
    <div className='font-inter bg-black min-h-screen flex flex-col items-center justify-center'>
      <div className='flex flex-wrap'>
            <section className="absolute left-0 top-2 h-16 w-16">
                <nav className="flex justify-between bg-black text-gray-300 w-screen">
                    <div className="px-5 xl:px-12 py-6 flex w-full items-center">
                        <a className="text-4xl font-black bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-text" href="/">
                            🐥📜
                        </a>

                        <ul className="flex mx-auto font-thin space-x-14 items-center justify-center">
                            <li>
                              <a className="hover:text-gray-200 ml-28" href="/">
                                App
                              </a>
                            </li>

                            <li>
                              <a className="hover:text-gray-200" href="https://tweet-scribe-about.vercel.app/" target="_blank" rel="noopener noreferrer">
                              About the project
                              </a>
                            </li>

                            <li>
                              <a className="hover:text-gray-200" href="https://github.com/RexanWONG/TweetScribe/" target="_blank" rel="noopener noreferrer">
                                Github
                              </a>
                            </li>
                        </ul>

                        {signedInWithTwitter ? (
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
                            
                        ) : (
                            <button onClick={() => signInWithTwitter()} className="font-thin border-2 border-blue-500 rounded-lg px-3 py-2 text-white cursor-pointer hover:bg-blue-500 hover:text-black focus:outline-none shadow-lg shadow-neon transition duration-800 ease-in-out">
                                Sign in with Twitter 
                            </button>
                        )}
                       
                    </div> 
                </nav>
            </section>
        </div>
        
      <div className='flex flex-col text-center items-center justify-center mt-32'>
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
      <div className='relative left-80'>
        <div className="flex items-center justify-end mt-2 p-4">
            <span className="text-white font-bold text-lg mr-2">Word count:</span>
            {wordCount <= 8000 ? (
              <span className="text-white font-bold text-lg">{wordCount}/8000</span>
            ) : (
              <span className="text-red-400 font-bold text-lg">{wordCount}/8000</span>
            )}
            
        </div>
      </div>

      <div className='flex flex-col items-center justify-center mt-16'>
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
                  <h2 className='text-left text-white font-thin mt-1'>Instantly writes a twitter thread based on the text provided.  Usally lower accuracy compared to the statement orientated process, but quicker</h2>
                </button>
              </div>
            </div>
          ) : (
            <div className='rounded-lg bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-1 mt-10 max-w-[450px] animate-text'>
              <div className='flex flex-col p-4'>
                <button>
                  <h1 className='text-left text-3xl text-black font-bold'>🚀 Instant thread</h1>
                  <h2 className='text-left text-black mt-1'>Instantly writes a twitter thread based on the text provided.  Usally lower accuracy compared to the statement orientated process, but quicker</h2>
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
    </div>
  )
}

export default App
