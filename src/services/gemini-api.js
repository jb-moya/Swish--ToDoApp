import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";
import useShowToast from "./../hooks/useShowToast";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
// const apiKey = "";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
});

const generationConfig = {
    temperature: 2,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 1000,
    responseMimeType: "application/json",
    responseSchema: {
        type: "object",
        properties: {
            response: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        taskName: {
                            type: "string",
                        },
                        description: {
                            type: "string",
                        },
                    },
                },
            },
        },
    },
};

async function run({ message }) {
    const showToast = useShowToast();

    const chatSession = model.startChat({
        generationConfig,
        history: [],
    });

    try {
        const result = await chatSession.sendMessage(message);
        console.log(result.response.text());
        console.log(result.response);
    } catch (error) {
        showToast("Error", error.message, "error");
        console.error("ERROR!!:", error);
    }
}

export default run;
