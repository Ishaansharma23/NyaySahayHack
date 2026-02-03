import { Pinecone } from '@pinecone-database/pinecone';

let nyaySahayIndex = null;

const initPinecone = () => {
    if (nyaySahayIndex) return nyaySahayIndex;

    const apiKey = process.env.PINECONE_API_KEY;
    if (!apiKey) {
        return null;
    }

    const pc = new Pinecone({ apiKey });
    nyaySahayIndex = pc.Index('nyaysahay');
    return nyaySahayIndex;
};

// This function will create memory
export async function createMemory({ vectors, metadata, messageId }) {
    try {
        const index = initPinecone();
        if (!index) return;

        await index.upsert([
            {
                id: messageId.toString(),
                values: vectors,
                metadata
            }
        ]);
    } catch (error) {
        console.error("Error creating memory:", error);
        throw error;
    }
}

export async function queryMemory({ queryVector, limit = 5, metadata }) {
    try {
        const index = initPinecone();
        if (!index) return [];

        const data = await index.query({
            vector: queryVector,
            topK: limit,
            filter: metadata ? metadata : undefined,
            includeMetadata: true
        });
        return data.matches;
    } catch (error) {
        console.error("Error querying memory:", error);
        throw error;
    }
}
