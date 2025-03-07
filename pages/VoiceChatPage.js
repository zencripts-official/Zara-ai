function VoiceChatPage() {
    try {
        const [messages, setMessages] = React.useState([]);
        const [isProcessing, setIsProcessing] = React.useState(false);
        const [isListening, setIsListening] = React.useState(false);
        const [error, setError] = React.useState('');
        const chatContainerRef = React.useRef(null);
        
        // Speech synthesis setup
        const speakResponse = (text) => {
            if (!('speechSynthesis' in window)) {
                setError('Speech synthesis is not supported in your browser.');
                return;
            }
            
            // Stop any ongoing speech
            window.speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            
            window.speechSynthesis.speak(utterance);
        };
        
        const scrollToBottom = () => {
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        };

        React.useEffect(() => {
            scrollToBottom();
        }, [messages]);
        
        const handleVoiceInput = async (transcript) => {
            if (!transcript.trim()) return;
            
            try {
                const newMessages = [...messages, { type: 'user', content: transcript }];
                setMessages(newMessages);
                setIsProcessing(true);
                setError('');
                
                const chatAgent = createChatAgent(messages);
                const response = await chatAgent(transcript);
                
                setMessages([...newMessages, { type: 'ai', content: response }]);
                
                // Speak the response
                speakResponse(response);
            } catch (err) {
                console.error('Voice chat failed:', err);
                setError('Failed to process voice input. Please try again.');
                setMessages([
                    ...messages,
                    { type: 'ai', content: 'Sorry, I encountered an error. Please try again.' }
                ]);
            } finally {
                setIsProcessing(false);
                setIsListening(false);
            }
        };
        
        const startListening = () => {
            if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
                setError('Speech recognition is not supported in your browser.');
                return;
            }
            
            setError('');
            setIsListening(true);
            
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';
            
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                handleVoiceInput(transcript);
            };
            
            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setError(`Error: ${event.error}`);
                setIsListening(false);
            };
            
            recognition.onend = () => {
                if (isListening) {
                    setIsListening(false);
                }
            };
            
            recognition.start();
        };

        return (
            <div className="flex flex-col h-screen p-4" data-name="voice-chat-page">
                <div className="mb-6 text-center" data-name="voice-chat-header">
                    <h2 className="text-2xl font-bold text-gray-800">Voice Chat</h2>
                    <p className="text-gray-600">Talk with Zara AI using your voice</p>
                </div>
                
                <div 
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto mb-4"
                    data-name="voice-chat-messages"
                >
                    {messages.length === 0 ? (
                        <div className="text-center text-gray-500 mt-10" data-name="voice-empty-state">
                            <i className="fas fa-microphone text-4xl mb-2"></i>
                            <p>Click the microphone button below to start speaking with Zara AI</p>
                        </div>
                    ) : (
                        messages.map((msg, index) => (
                            <ChatMessage
                                key={index}
                                message={msg.content}
                                type={msg.type}
                            />
                        ))
                    )}
                    {isProcessing && (
                        <div className="message-bubble ai-message animate-pulse" data-name="voice-typing-indicator">
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            </div>
                        </div>
                    )}
                </div>
                
                {error && (
                    <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-lg" data-name="voice-error">
                        {error}
                    </div>
                )}
                
                <div className="text-center py-4" data-name="voice-controls">
                    <button
                        onClick={startListening}
                        disabled={isListening || isProcessing}
                        className={`p-6 rounded-full ${
                            isListening
                                ? 'bg-red-500 animate-pulse'
                                : isProcessing
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-blue-500 hover:bg-blue-600'
                        } text-white shadow-lg`}
                        data-name="voice-input-button"
                    >
                        <i className={`fas ${isListening ? 'fa-stop' : 'fa-microphone'} text-2xl`}></i>
                    </button>
                    <p className="mt-2 text-gray-600">
                        {isListening ? 'Listening...' : isProcessing ? 'Processing...' : 'Tap to speak'}
                    </p>
                </div>
            </div>
        );
    } catch (error) {
        console.error('VoiceChatPage component error:', error);
        reportError(error);
        return null;
    }
}
