import { generateText } from '../services/openai.service.js' ; // or '../services/ollama.service.js' if we want to try Ollama

export const generateAIResponse = async (req, res) => {
    try {
        const { prompt } = req.body;

        const aiResponse = await generateText(prompt);
        res.status(200).json({ response: aiResponse });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};