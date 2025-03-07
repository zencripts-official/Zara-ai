function ChatPage() {
    try {
        const [messages, setMessages] = React.useState([]);
        const [isProcessing, setIsProcessing] = React.useState(false);
        const chatContainerRef = React.useRef(null);

        const scrollToBottom = () => {
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        };

        React.useEffect(() => {
            scrollToBottom();
        }, [messages]);

        const handleSendMessage = async (message) => {
            try {
                const newMessages = [...messages, { type: 'user', content: message }];
                setMessages(newMessages);
                setIsProcessing(true);

                const chatAgent = createChatAgent(messages);
                const response = await chatAgent(message);

                setMessages([...newMessages, { type: 'ai', content: response }]);
            } catch (error) {
                console.error('Failed to send message:', error);
                setMessages([
                    ...newMessages,
                    { type: 'ai', content: 'Sorry, I encountered an error. Please try again.' }
                ]);
            } finally {
                setIsProcessing(false);
            }
        };

        return (
            <div className="flex flex-col h-screen" data-name="chat-page">
                <div 
                    ref={chatContainerRef}
                    className="chat-container responsive-padding"
                    data-name="chat-messages-container"
                >
                    {messages.length === 0 ? (
                        <div className="text-center text-gray-500 mt-10" data-name="empty-state">
                            <i className="fas fa-comments text-2xl sm:text-4xl mb-2"></i>
                            <p className="text-sm sm:text-base">Start a conversation with Zara AI</p>
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
                        <div className="message-bubble ai-message animate-pulse" data-name="typing-indicator">
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            </div>
                        </div>
                    )}
                </div>
                <ChatInput onSendMessage={handleSendMessage} isProcessing={isProcessing} />
            </div>
        );
    } catch (error) {
        console.error('ChatPage component error:', error);
        reportError(error);
        return null;
    }
}
