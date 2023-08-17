import { randomTextSamples } from "../constants";

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY

export function getRandomTextSample(textSample) {
    const randomIndex = Math.floor(Math.random() * randomTextSamples.length);
    const randomTextSample = randomTextSamples[randomIndex];
  
    if (randomTextSample === textSample) return getRandomTextSample(textSample);
  
    return randomTextSample;
}

export async function generateStatementsFromText(wordCount, inputText) {
    try {
      console.log("Calling the OpenAI API");

      if (wordCount <= 2000 && wordCount >= 100) {
        const APIBody = {
          "model": "text-davinci-003",
          "prompt": `You are my writing assistant.  You are going to generate 8 important statements from the following 
          text that I will give you.  The statements should be very clear so that even without reading the 
          entire text, the person reading the statements will understand the istdeas of the entire text.  Make the statements informative and clear.  
          Also, in the middle of each statement, 
          seperate them with a new line programatically (\n).  So without further ado, here is the text that I will give you : 
          ${inputText}`,
  
          "temperature": 1,
          "max_tokens": 400,
          "top_p": 1.0,
          "frequency_penalty": 0.0,
          "presence_penalty": 0.0
        }
  
        const response = await fetch("https://api.openai.com/v1/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + API_KEY
          }, 

          body: JSON.stringify(APIBody)
        })

        const data = await response.json();
        console.log(data);
        return data;

      } else if (wordCount > 2000) {
        const inputChunks = splitTextByPercentage(inputText, 0.3);
        const allImportantStatements = [];

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

        const response = await fetch("https://api.openai.com/v1/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + API_KEY,
          },
          body: JSON.stringify(finalAPIBody),
        })
        
        const data = await response.json();
        console.log(data);
        return data;

      } else {
        alert("Enter some more text!")
      }
    } catch (error) {
      console.error(error)
    }
}

export async function generateThreadFromStatements(
    emojiLevel,
    hashtagLevel,
    statements,
    threadTone,
    numOfTweetsInThread,
) {
    try {
      console.log("Calling the OpenAI API");

      if (emojiLevel == 0) {
        emojiLevel = "Don't use emojis throughout the thread"
      } else if (emojiLevel == 0.5) {
        emojiLevel = "Use emojis throughout the thread, but not too overwhelming and many."
      } else if (emojiLevel == 1) {
        emojiLevel = "Use lots of emojis throughout the thread!  A lot!  In fact, maybe AT LEAST 3 emojis per tweet!"
      }

      if (hashtagLevel == 0) {
        hashtagLevel = "Dont use hashtags throughout the thread"
      } else if (hashtagLevel == 0.5) {
        hashtagLevel = "Use some hashtags throughout the thread, but not too overwhelming and many."
      } else if (hashtagLevel == 1) {
        hashtagLevel = "Use lots of hashtags throughout the thread"
      }

      const APIBody = {
        "model": "text-davinci-003",
        "prompt": `I will give you a list of important statements.  Here are the statements : ${statements}. 
        Please use the statements to write a well written Twitter thread.  Set the tone throughout the thread to be ${threadTone}.  
        ${emojiLevel}.  ${hashtagLevel}. For the intro tweet of the thread, I need an engaging and concise introduction for my Twitter thread, 
        possibly including a surprising statistic, a relevant news item, or an interesting anecdote, quote, or irony to draw in my audience and set the tone for the rest of the thread. 
        I also require a strong conclusion that ties together the main points and reinforces the message, 
        potentially ending with a call to action or thought-provoking statement to encourage further engagement.
        For each tweet in a thread, put the number in front of it (eg first tweet, 1.  Second tweet, 2.).  
         Limit the num of tweets in the thread to ${numOfTweetsInThread} tweets.`,
        
        "temperature": 1,
        "max_tokens": 3000,
        "top_p": 1.0,
        "frequency_penalty": 0.0,
        "presence_penalty": 0.0
      }

      const response = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + API_KEY,
        }, 
        body: JSON.stringify(APIBody)
      })

      const data = await response.json();
      console.log(data);
      return data;

    } catch (error) {
      alert(error)
    }
}

export async function generateInstantThreadFromText(
    inputText,
    emojiLevel,
    hashtagLevel,
    threadTone,
    numOfTweetsInThread
  ) {
    try {
      console.log("Calling the OpenAI API");
  
      const inputChunks = splitTextByPercentage(inputText, 0.3);
      const allImportantStatements = [];
  
      for (const chunk of inputChunks) {
        const prompt = `You are my writing assistant. Write a paragraph to summarize the text. The paragraph should be very clear so that even without reading the entire text, 
        the person reading the statements will understand the ideas of the entire text. Paragraph should be around 2 sentences.  
        Make the paragraph informative and clear. So without further ado, here is the text that I will give you: ${chunk}`;
  
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
  
      const threadData = await generateThreadFromStatements(
        emojiLevel,
        hashtagLevel,
        combinedStatements,
        threadTone,
        numOfTweetsInThread
      );
  
      return threadData;
  
    } catch (error) {
      alert(error);
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
