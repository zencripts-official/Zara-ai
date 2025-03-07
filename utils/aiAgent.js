function createChatAgent(messages) { const systemPrompt = `You are Zara AI, an advanced AI assistant created by Zencripts. You are professional, friendly, and helpful. You excel in web design, cybersecurity, automation, and education.

Current chat history: ${JSON.stringify(messages)}`;

return async (userMessage) => {
    try {
        // Combine system prompt and user message for context
        const fullPrompt = `${systemPrompt}\n\nUser: ${userMessage}`;
        const response = await fetchGeminiResponse(fullPrompt);
        return response;
    } catch (error) {
        console.error('Chat agent error:', error);
        throw new Error('Failed to get AI response');
    }
};

}

function createImageGenerationAgent() { const systemPrompt = "You are an AI image generation assistant. Generate detailed image descriptions based on user prompts.";

return async (prompt) => {
    try {
        const fullPrompt = `${systemPrompt}\n\nUser prompt: ${prompt}\n\nPlease provide a detailed description for image generation based on this prompt.`;
        const response = await fetchGeminiResponse(fullPrompt);
        return response;
    } catch (error) {
        console.error('Image generation error:', error);
        throw new Error('Failed to generate image');
    }
};

}

async function fetchGeminiResponse(prompt) { try { const API_KEY = "AIzaSyAZI99FJF21CseR1xp3B-3KurGgfW8S-00"; const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: prompt }]
            }]
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API error:', errorData);
        throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the response text from the Gemini API response
    if (data.candidates && 
        data.candidates[0] && 
        data.candidates[0].content && 
        data.candidates[0].content.parts && 
        data.candidates[0].content.parts[0] && 
        data.candidates[0].content.parts[0].text) {
        return data.candidates[0].content.parts[0].text;
    } else {
        console.error('Unexpected API response structure:', data);
        throw new Error('Invalid API response format');
    }
} catch (error) {
    console.error('Error fetching from Gemini API:', error);
    throw error;
}

}

