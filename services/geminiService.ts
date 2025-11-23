import { GoogleGenAI } from "@google/genai";

const getApiKey = (): string => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API_KEY environment variable not set");
    }
    return apiKey;
};

export const getLuckyPhrase = async (numbers: number[]): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey: getApiKey() });

        const prompt = `Numero sorteado ${numbers.join(', ')}. Crie uma frase curta, criativa e otimista com no máximo 15 palavras sobre sorte, futuro ou prosperidade, inspirada nesse número. Seja poético e inspirador.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.8,
                topP: 0.9,
            }
        });

        const text = response.text.trim();
        // Remove potential markdown like asterisks for bolding
        return text.replace(/\*/g, '');
        
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Could not generate a lucky phrase.");
    }
};