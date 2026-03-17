# 🧠 Neural-Doc

> Chat with your PDF documents using AI — powered by LangChain, Google Gemini, and Pinecone.

Neural-Doc is a **RAG (Retrieval-Augmented Generation)** based CLI tool that lets you ask natural language questions about any PDF document. It parses your PDF, converts content into vector embeddings, stores them in Pinecone, and uses Google Gemini to answer your queries with context from the document.

---

## ✨ Features

- 📄 **PDF Ingestion** — Parses and chunks PDF documents automatically
- 🔢 **Vector Embeddings** — Converts text chunks into embeddings using Google Generative AI
- 📦 **Pinecone Vector Store** — Stores and retrieves embeddings efficiently
- 🤖 **Google Gemini LLM** — Generates accurate, context-aware answers
- 💬 **Interactive CLI** — Ask questions in a conversational terminal interface
- ⚡ **LangChain Pipeline** — Clean and modular RAG architecture

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| LangChain | RAG pipeline orchestration |
| Google Gemini (`@langchain/google-genai`) | LLM for answer generation + embeddings |
| Pinecone (`@langchain/pinecone`) | Vector database for semantic search |
| `pdf-parse` | PDF text extraction |
| `readline-sync` | Interactive CLI interface |
| `dotenv` | Environment variable management |

---

## 📁 Project Structure

```
Neural-Doc/
├── indexing.js       # Parses PDF, creates embeddings, and indexes into Pinecone
├── query.js          # CLI interface to query the indexed document
├── node.pdf          # Sample PDF document (Node.js docs)
├── package.json      # Project dependencies
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- A [Pinecone](https://www.pinecone.io/) account and API key
- A [Google AI Studio](https://aistudio.google.com/) API key (for Gemini)

### 1. Clone the Repository

```bash
git clone https://github.com/Negi04/Neural-Doc.git
cd Neural-Doc
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
GOOGLE_API_KEY=your_google_api_key_here
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_INDEX=your_pinecone_index_name
```

### 4. Index Your PDF

Run the indexing script to parse your PDF and push embeddings to Pinecone:

```bash
node indexing.js
```

### 5. Query Your Document

Start the interactive Q&A session:

```bash
node query.js
```

You can now ask any question about your PDF in natural language!

---

## 💡 How It Works

```
PDF File
   │
   ▼
pdf-parse (Text Extraction)
   │
   ▼
Text Chunking (LangChain Text Splitter)
   │
   ▼
Google Gemini Embeddings
   │
   ▼
Pinecone Vector Store (Indexed)
   │
   ▼
User Query ──► Semantic Search ──► Top K Chunks ──► Gemini LLM ──► Answer
```

1. **Indexing Phase** (`indexing.js`): The PDF is parsed, split into overlapping chunks, converted into vector embeddings via Google Gemini, and stored in Pinecone.
2. **Query Phase** (`query.js`): The user's question is embedded and used to search Pinecone for the most relevant chunks. These chunks are passed as context to Gemini, which generates a grounded answer.

---

## 📦 Dependencies

```json
"@langchain/community": "^1.1.23",
"@langchain/core": "^1.1.32",
"@langchain/google-genai": "^2.1.25",
"@langchain/pinecone": "^1.0.1",
"@pinecone-database/pinecone": "^5.1.2",
"dotenv": "^17.3.1",
"pdf-parse": "^1.1.4",
"readline-sync": "^1.4.10"
```

---

## 🔮 Future Improvements

- [ ] Support for multiple PDFs simultaneously
- [ ] Web UI (React frontend)
- [ ] Conversation memory / multi-turn chat
- [ ] Support for other document types (DOCX, TXT, URLs)
- [ ] Docker support for easy deployment

---

## 🙌 Acknowledgements

- [LangChain JS](https://js.langchain.com/)
- [Google Gemini](https://ai.google.dev/)
- [Pinecone](https://www.pinecone.io/)

---

## 📄 License

This project is licensed under the ISC License.