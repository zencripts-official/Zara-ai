function ChatInput({ onSendMessage, isProcessing }) {
    try {
        const [message, setMessage] = React.useState('');

        const handleSubmit = (e) => {
            e.preventDefault();
            if (message.trim() && !isProcessing) {
                onSendMessage(message);
                setMessage('');
            }
        };

        const handleVoiceInput = (transcript) => {
            setMessage(transcript);
        };

        return (
            <form 
                onSubmit={handleSubmit} 
                className="chat-input-container"
                data-name="chat-input-form"
            >
                <div className="w-full max-w-4xl mx-auto flex items-center space-x-2 sm:space-x-4">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 p-2 sm:p-3 text-sm sm:text-base rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                        disabled={isProcessing}
                        data-name="chat-input-field"
                    />
                    <VoiceInput onVoiceInput={handleVoiceInput} />
                    <button
                        type="submit"
                        disabled={isProcessing || !message.trim()}
                        className={`p-2 sm:p-3 rounded-lg ${
                            isProcessing || !message.trim()
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600'
                        } text-white`}
                        data-name="chat-submit-button"
                    >
                        {isProcessing ? (
                            <i className="fas fa-spinner fa-spin"></i>
                        ) : (
                            <i className="fas fa-paper-plane"></i>
                        )}
                    </button>
                </div>
            </form>
        );
    } catch (error) {
        console.error('ChatInput component error:', error);
        reportError(error);
        return null;
    }
                          }
