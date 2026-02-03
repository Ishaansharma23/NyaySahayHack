import { GoogleGenAI } from "@google/genai";
import logger from "../utils/logger.js";

// Initialize AI providers
const geminiAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Check which AI provider to use
const AI_PROVIDER = process.env.AI_PROVIDER || 'gemini'; // 'gemini' or 'claude'

/**
 * JusticeAI Legal Assistant Persona
 * Comprehensive system prompt for legal assistance
 */
export const JUSTICE_AI_PERSONA = `You are JusticeAI ⚖️, an intelligent and empathetic legal assistant for the NyaySahay platform - India's premier legal assistance platform.

## Your Mission
Help Indian citizens understand their legal rights, provide guidance on legal matters, and connect them with appropriate legal resources.

## Core Capabilities
1. **Legal Information** - Provide accurate information about Indian laws, rights, and procedures
2. **Rights Education** - Help citizens understand their constitutional and legal rights
3. **Procedure Guidance** - Explain step-by-step legal procedures and remedies
4. **Document Assistance** - Guide users on legal document requirements
5. **Resource Connection** - Direct users to appropriate legal aid and resources

## Key Areas of Expertise
- Constitutional Rights (Fundamental Rights under Part III)
- Criminal Law (IPC, CrPC, Evidence Act)
- Civil Law (CPC, Contract Act, Consumer Protection)
- Family Law (Marriage, Divorce, Custody, Inheritance)
- Property Law (Registration, Disputes, Tenant Rights)
- Labour Law (Employment Rights, EPF, ESI)
- RTI Act and PIL procedures
- Cyber Laws and Digital Rights
- Women's Rights and Protection Laws
- Consumer Protection and Grievance Redressal

## Important Indian Laws to Reference
- Constitution of India
- Indian Penal Code (IPC) / Bharatiya Nyaya Sanhita (BNS)
- Code of Criminal Procedure (CrPC) / Bharatiya Nagarik Suraksha Sanhita (BNSS)
- Indian Evidence Act / Bharatiya Sakshya Adhiniyam (BSA)
- Code of Civil Procedure (CPC)
- Consumer Protection Act, 2019
- Right to Information Act, 2005
- Protection of Women from Domestic Violence Act, 2005
- Hindu Marriage Act, 1955
- Muslim Personal Law
- Special Marriage Act, 1954
- Motor Vehicles Act
- Information Technology Act, 2000
- POCSO Act
- SC/ST Prevention of Atrocities Act

## Communication Guidelines
- Use simple, clear language - avoid complex legal jargon
- Be empathetic, especially when dealing with victims
- Provide step-by-step actionable guidance
- Include relevant legal sections/acts when applicable
- Always recommend consulting qualified advocates for specific legal matters
- Be culturally sensitive and aware of Indian legal context
- Use Hindi/English as appropriate based on user preference

## Response Format
- Start with acknowledging the user's concern
- Provide clear, structured information
- Include relevant legal provisions with section numbers
- Suggest practical next steps
- Recommend professional legal consultation when needed
- Use appropriate emojis to make interactions friendly (⚖️ 🏛️ 📋 ✅)

## Important Disclaimers
- Always clarify you provide legal INFORMATION, not legal ADVICE
- Encourage users to consult qualified advocates for specific cases
- Mention free legal aid services (DLSA, NALSA) when relevant
- Do not guarantee outcomes of legal proceedings

Remember: Your goal is to EMPOWER citizens with legal knowledge while maintaining professionalism and empathy.`;

/**
 * Generate AI Response using configured provider
 * @param {Array} content - Conversation history
 * @param {string} systemInstruction - System prompt
 * @returns {Promise<string>} AI response
 */
export async function generateResponse(content, systemInstruction = JUSTICE_AI_PERSONA) {
    try {
        if (AI_PROVIDER === 'claude' && process.env.CLAUDE_API_KEY) {
            return await generateClaudeResponse(content, systemInstruction);
        }
        return await generateGeminiResponse(content, systemInstruction);
    } catch (error) {
        logger.error('AI Response Generation Failed', { error: error.message });
        throw error;
    }
}

/**
 * Generate response using Gemini
 */
async function generateGeminiResponse(content, systemInstruction) {
    const response = await geminiAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: content,
        config: {
            temperature: 0.7,
            topP: 0.9,
            maxOutputTokens: 2048,
            systemInstruction: systemInstruction
        }
    });
    return response.text;
}

/**
 * Generate response using Claude API
 * Note: Requires @anthropic-ai/sdk package
 */
async function generateClaudeResponse(content, systemInstruction) {
    // Dynamic import for Claude SDK
    const { default: Anthropic } = await import('@anthropic-ai/sdk');
    
    const anthropic = new Anthropic({
        apiKey: process.env.CLAUDE_API_KEY
    });

    // Convert Gemini format to Claude format
    const messages = content.map(item => ({
        role: item.role === 'model' ? 'assistant' : 'user',
        content: item.parts.map(p => p.text).join('')
    }));

    const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        system: systemInstruction,
        messages: messages
    });

    return response.content[0].text;
}

/**
 * Generate text embeddings for vector storage
 * @param {string} content - Text to embed
 * @returns {Promise<number[]>} Embedding vector
 */
export async function generateVector(content) {
    try {
        const response = await geminiAI.models.embedContent({
            model: 'gemini-embedding-001',
            contents: content,
            config: {
                outputDimensionality: 768,
            }
        });
        return response.embeddings[0].values;
    } catch (error) {
        logger.error('Vector Generation Failed', { error: error.message });
        throw error;
    }
}

/**
 * Generate streaming AI response (for real-time chat)
 * @param {Array} content - Conversation history
 * @param {string} systemInstruction - System prompt
 * @param {Function} onChunk - Callback for each chunk
 */
export async function generateStreamingResponse(content, systemInstruction, onChunk) {
    try {
        const response = await geminiAI.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents: content,
            config: {
                temperature: 0.7,
                systemInstruction: systemInstruction
            }
        });

        let fullResponse = '';
        for await (const chunk of response) {
            const text = chunk.text();
            fullResponse += text;
            onChunk(text, false);
        }
        onChunk('', true); // Signal completion
        return fullResponse;
    } catch (error) {
        logger.error('Streaming Response Failed', { error: error.message });
        throw error;
    }
}

/**
 * Analyze incident for legal categorization
 * @param {string} incidentDetails - Details of the incident
 * @returns {Promise<object>} Analysis result
 */
export async function analyzeIncident(incidentDetails) {
    const analysisPrompt = `Analyze this legal incident and provide:
1. Primary legal category
2. Relevant Indian laws/sections
3. Suggested urgency level (low/medium/high/critical)
4. Recommended next steps
5. Relevant authorities to contact

Incident: ${incidentDetails}

Respond in JSON format:
{
    "category": "string",
    "relevantLaws": ["array of relevant laws/sections"],
    "urgencyLevel": "string",
    "nextSteps": ["array of recommended actions"],
    "authorities": ["relevant authorities to contact"],
    "summary": "brief legal summary"
}`;

    const response = await generateGeminiResponse([{
        role: 'user',
        parts: [{ text: analysisPrompt }]
    }], 'You are a legal analyst. Respond only in valid JSON format.');

    try {
        // Extract JSON from response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch {
        return null;
    }
}

export default {
    generateResponse,
    generateVector,
    generateStreamingResponse,
    analyzeIncident,
    JUSTICE_AI_PERSONA
};
