require('dotenv').config(); // Load environment variables securely

function createChatAgent(messages) {
    const systemPrompt = `You are Zara AI, an advanced AI assistant created by Zencripts. 
You specialize in web design, cybersecurity, automation, and education. 
You are professional, friendly, and helpful.

Current Chat History:
${JSON.stringify(messages)}`;

    return async (userMessage) => {
        try {
            const fullPrompt = `${systemPrompt}\n\nUser: ${userMessage}`;
            return await fetchGeminiResponse(fullPrompt);
        } catch (error) {
            console.error('Chat Agent Error:', error.message);
            return "Sorry, an error occurred while processing your request.";
        }
    };
}

function createImageGenerationAgent() {
    const systemPrompt = "You are an AI image generation assistant. Generate detailed descriptions based on user prompts.";

    return async (prompt) => {
        try {
            const fullPrompt = `${systemPrompt}\n\nUser Prompt: ${prompt}`;
            return await fetchGeminiResponse(fullPrompt);
        } catch (error) {
            console.error('Image Generation Error:', error.message);
            return "Sorry, image generation failed.";
        }
    };
}

async function fetchGeminiResponse(prompt) {
    try {
        const API_KEY = process.env.API_KEY; 
        if (!API_KEY) throw new Error("API Key missing. Set API_KEY in the environment.");

        const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Gemini API Error:', errorData);
            throw new Error(`API Error: ${response.status} - ${errorData.error.message}`);
        }

        const data = await response.json();
        return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";
        
    } catch (error) {
        console.error('Error fetching from Gemini API:', error);
        return "AI service is temporarily unavailable.";
    }
}

module.exports = { createChatAgent, createImageGenerationAgent };
