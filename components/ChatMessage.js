function ChatMessage({ message, type }) {
    try {
        return (
            <div 
                className={`message-bubble ${type}-message animate-fade-in`}
                data-name={`chat-message-${type}`}
            >
                <div className="flex items-start space-x-2">
                    {type === 'ai' && (
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-100 flex items-center justify-center" data-name="ai-avatar">
                            <i className="fas fa-robot text-blue-600 text-xs sm:text-base"></i>
                        </div>
                    )}
                    <div className="flex-1" data-name="message-content">
                        <p className="text-gray-800 whitespace-pre-wrap text-sm sm:text-base">{message}</p>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('ChatMessage component error:', error);
        reportError(error);
        return null;
    }
}
