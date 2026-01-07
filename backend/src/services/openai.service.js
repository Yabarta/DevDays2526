import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export const generateText = async (prompt) => {
    const response = await openai.responses.create({
        model: 'gpt-5-mini',
        input: prompt,
    });
    return response.output_text;
};

export const generateSpeechFromText = async (text, options = {}) => {

    const model = options.model || 'gpt-4o-mini-tts';
    const voice = options.voice || 'alloy';
    const format = options.format || 'wav';

    const resp = await openai.audio.speech.create({
        model,
        voice,
        input: text,
        format,
    });

    const arrayBuffer = await resp.arrayBuffer();
    return Buffer.from(arrayBuffer);
};