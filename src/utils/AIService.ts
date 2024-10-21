import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, ChatSession } from "@google/generative-ai";

let chatSession: ChatSession | undefined = undefined;

const LoadGemini = () : boolean => {
    let apiKey: string = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey || apiKey.length === 0) {
        console.log('loadGemini failed to fetch api keys');
        return false;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction :"Do not ask anything from your end, just return data as requested"
    });

    const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
    };

    chatSession = model.startChat({
        generationConfig,
        history: [
        ],
    });
    return true;
}

const GetResponse = async (instruction: string): Promise<string> => {
    if (chatSession) {
        const result = await chatSession.sendMessage(instruction);
        return result.response.text();
    }

    return 'Invalid response';
}

export { LoadGemini, GetResponse };