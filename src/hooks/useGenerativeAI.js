import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import useShowToast from "./../hooks/useShowToast";
import useAddTask from "../hooks/useAddTask";
import useCategoryStore from "../store/categoryStore";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
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
                        taskName: { type: "string" },
                        description: { type: "string" },
                        priority: {
                            type: "string",
                            enum: ["0", "1", "2", "3", "4"],
                        },
                    },
                    required: ["taskName"],
                },
            },
        },
        required: ["response"],
    },
};

const useGenerativeAI = () => {
    const { handleAddTask } = useAddTask();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const { selectedCategoryId } = useCategoryStore();
    const showToast = useShowToast();

    const handleAddingTask = async (task) => {
        try {
            await handleAddTask(task);
        } catch (error) {
            showToast("Error", error.message, "error");
        }
    };

    const addMultipleTasks = (result) => {
        if (!result || !Array.isArray(result.response)) {
            return;
        }

        result.response.forEach((task) => {
            if (task && typeof task === "object") {
                const taskName = task.taskName || "Unnamed Task";
                const description = task.description || null;
                const priority = Number(task.priority) || 0;

                console.log(`Task: ${taskName}`);
                console.log(`Description: ${description}`);

                handleAddingTask({
                    taskName: taskName,
                    description: description,
                    category: selectedCategoryId,
                    priority: priority,
                });
            }
        });
    };

    const run = async ({ message }) => {
        setLoading(true);
        setError(null);
        setResult(null);

        const chatSession = model.startChat({
            generationConfig,
            history: [],
        });

        try {
            const response = await chatSession.sendMessage(message);

            if (
                response.response &&
                typeof response.response.text === "function"
            ) {
                const text = await response.response.text();
                addMultipleTasks(JSON.parse(text));
                console.log(text, typeof text);
            } else {
                throw new Error("Invalid response structure");
            }
        } catch (error) {
            setError(error);
            showToast("Error", error.message || "An error occurred", "error");
            console.error("ERROR!!:", error);
        } finally {
            setLoading(false);
        }
    };

    return { run, loading, error, result };
};

export default useGenerativeAI;
