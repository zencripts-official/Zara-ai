(function() {
    function obf(str) {
        return str.split('').map(c => c.charCodeAt(0) + 3).map(c => String.fromCharCode(c)).join('');
    }

    const messages = [];
    const systemPrompt = obf("You are Zara AI, an advanced AI assistant created by Zencripts. You are professional, friendly, and helpful. You excel in web design, cybersecurity, automation, and education.\n\nCurrent chat history:\n") + JSON.stringify(messages);

    async function fetchGeminiResponse(prompt) {
        try {
            const API_KEY = obf("AIzaSyAZI99FJF21CseR1xp3B-3KurGgfW8S-00").split('').map(c => String.fromCharCode(c.charCodeAt(0) - 3)).join('');
            const API_URL = obf("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent").split('').map(c => String.fromCharCode(c.charCodeAt(0) - 3)).join('');

            const response = await fetch(`${API_URL}?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            return data?.candidates?.[0]?.content?.parts?.[0]?.text || "Error: Invalid response format";
        } catch (error) {
            console.error('Fetch Error:', error);
            throw error;
        }
    }

    window.createChatAgent = function(messages) {
        return async (userMessage) => {
            return fetchGeminiResponse(`${systemPrompt}\n\nUser: ${userMessage}`);
        };
    };

    window.createImageGenerationAgent = function() {
        return async (prompt) => {
            return fetchGeminiResponse(obf("You are an AI image generation assistant. Generate detailed image descriptions based on user prompts.\n\nUser prompt: ") + prompt);
        };
    };
})();
