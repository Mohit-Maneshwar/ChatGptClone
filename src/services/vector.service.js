const { Pinecone } = require('@pinecone-database/pinecone');
const { v4: uuidv4 } = require("uuid");

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const cohortChatGptIndex = pc.index(process.env.PINECONE_INDEX || 'cohort-chat-gpt');

async function createMemory({ vectors, metadata, messageId }) {
  if (!vectors || vectors.length === 0) {
    throw new Error(" createMemory: vectors are empty");
  }

  await cohortChatGptIndex.upsert([
    {
      id: messageId ? messageId.toString() : uuidv4(),
      values: vectors,
      metadata: metadata || {}
    }
  ]);

  console.log(" Memory saved in Pinecone:", messageId?.toString() || "UUID");
}

async function queryMemory({ queryVector, limit = 5, metadata }) {
  if (!queryVector || queryVector.length === 0) {
    throw new Error(" queryMemory: queryVector is empty");
  }

  // ✅ only include filter if metadata has keys
  const filter = metadata && Object.keys(metadata).length > 0 ? metadata : undefined;

  const data = await cohortChatGptIndex.query({
    vector: queryVector,
    topK: limit,
    filter, // now safe
    includeMetadata: true
  });

  return data.matches || [];
}

module.exports = {
  createMemory,
  queryMemory
};
