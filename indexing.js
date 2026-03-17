import * as dotenv from 'dotenv';
dotenv.config();
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';

async function indexing(){
    // step1:Load the pdf file //
    const PDF_PATH = './node.pdf';
    const pdfLoader = new PDFLoader(PDF_PATH);
    const rawDocs = await pdfLoader.load();
    
    // Step2:Creating the chunks of the file //
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });
    const chunkedDocs = await textSplitter.splitDocuments(rawDocs);

    // Filter out empty chunks (Just to be safe!)
    const cleanDocs = chunkedDocs.filter(
        (doc) => doc.pageContent.trim().length > 0
    );

    // Step3: Now create the vectors of our chunked data //
    const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GEMINI_API_KEY,
        model: 'gemini-embedding-001',
    });

    const pinecone = new Pinecone();
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

    console.log("Pushing 3072-dimension vectors to Pinecone...");
    
    await PineconeStore.fromDocuments(cleanDocs, embeddings, {
        pineconeIndex,
        maxConcurrency: 5,
    });
    
    console.log("Successfully indexed!");
}

indexing();