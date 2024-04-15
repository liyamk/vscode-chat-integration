import "./constants";
import constants from './constants';
// dependency injection

// create interface for json response
interface ChatResponse {
   id : string,
   object : string,
   created : number,
   model : string
   choices : Array<Choice>,
   usage : {
      promptTokens : number,
      completionTokens : number,
      totalTokens: number
   }
}

interface Choice {
   index : string,
   message : Message,
   finish_reason : string
}


// create interface for json input
interface ChatPayload {
   readonly model : string,// "gpt-3.5-turbo"
   messages : Array<Message>,

}

interface Message {
   role : string,
   content: string
}

export class ResponseError extends Error {
   response : string;
   status: number;

   constructor(message : string, st : number, res : string) {
     super(message);
     this.status = st;
     this.response = res;
   }
 }

export async function fetchChatResponse(userContent : string) : Promise<ChatResponse> {
   const messages : Array<Message> = [
      {
         role: "system",
         content: "You are a helpful assistant here to answer question for developer. Try to give accurate answer, if you don't know the answer, you can respond 'I don't know the answer.'"
      },
      {
         role: "user",
         content: userContent
      }
   ];

   const payload :ChatPayload = {
      model: "gpt-3.5-turbo",
      messages: messages
   };

   const jsonPayload = JSON.stringify(payload);
   return await fetch(constants.apiBaseUrl + "chat/completions", {
      method: 'POST',
      headers: {
         'content-type': 'application/json',
         'Authorization': 'Bearer ' + constants.apiKey,
      },
      body: jsonPayload,
   })
   .then((response) => { 
      if (response.ok) {
         return response.json();
      }
      else {
         return response.text().then(text => {
            throw new ResponseError(response.statusText, response.status, text);
         })        
      }
   }) // Parse the response in JSON
   .then((response) =>{
      console.log("response as string ", response);
      return response as ChatResponse; // Cast the response type to our interface
   });

 }
