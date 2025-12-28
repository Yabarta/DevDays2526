import OpenAI from 'openai';

const openai = new OpenAI({
    baseURL: 'http://localhost:11434/v1',
    apiKey: 'ollama',
});

export const generateText = async (prompt) => {
    const response = await openai.responses.create({
        model: 'llama3.2:1b',
        input: prompt,
    });
    return response.output_text;
};