import readlineSync from 'readline-sync';
import { GoogleGenerativeAIEmbeddings,ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { Pinecone } from '@pinecone-database/pinecone';
import * as dotenv from 'dotenv';
dotenv.config();
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';


// LLM model we are using //

const model = new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-2.5-flash',  
    temperature: 0.3, 
});

// Model used for Embedding //

const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-embedding-001',
});


// Add this at the top of your file, outside any function
let chatHistory = [];

// configure Pinecone
const pinecone = new Pinecone();
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

async function chatting(question){

    let searchQuestion = question; // Default to user's question
    // Agar history hai, toh purane context ke hisaab se sawal ko rephrase karo
    if (chatHistory.length > 0) {
        const rephrasePrompt = PromptTemplate.fromTemplate(`
        Given the following chat history and a follow-up question, rephrase the follow-up question to be a standalone question.
        
        Chat History:
        {history}
        
        Follow Up Input: {question}
        Standalone question:`);

        const rephraseChain = RunnableSequence.from([
            rephrasePrompt,
            model,
            new StringOutputParser(),
        ]);

        // LLM hume ek naya, clear question bana kar dega
        searchQuestion = await rephraseChain.invoke({
            history: chatHistory.join("\n"),
            question: question,
        });
        
        console.log(`\n[AI Understood Your Intent As]: ${searchQuestion}\n`);
    }

    // Create embedding of question //
    
   const queryVector = await embeddings.embedQuery(searchQuestion);

    //Search inside the vector database for semantic search //
    
    const searchResults = await pineconeIndex.query({
    topK: 10,
    vector: queryVector,
    includeMetadata: true,
    });
    
    const context = searchResults.matches
                   .map(match => match.metadata.text)
                   .join("\n\n---\n\n");

 // Provinding the context to our model that what is it's uses //

const promptTemplate = PromptTemplate.fromTemplate(`
You are a helpful assistant answering questions based on the provided documentation.

Context from the documentation:
{context}

Question: {question}

Instructions:
- Answer the question using ONLY the information from the context above
- If the answer is not in the context, say "I don't have enough information to answer that question."
- Be concise and clear
- Use code examples from the context if relevant

Answer:
`);


// Step: Creating a chain to talk to our model //

const chain = RunnableSequence.from([
    promptTemplate,
    model,
    new StringOutputParser(),
]);

// Step: Invoke the chain and get the answer
const answer = await chain.invoke({
    context: context,
    question: searchQuestion,
});
            
console.log(answer);

chatHistory.push(`Human: ${question}`);
chatHistory.push(`AI: ${answer}`);

}

async function main(){
   const userProblem = readlineSync.question("Ask me anything--> ");
   await chatting(userProblem);
   main();
}

main();