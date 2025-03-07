function VoiceInput({ onVoiceInput }) {
    try {
        const [isListening, setIsListening] = React.useState(false);
        const [errorMessage, setErrorMessage] = React.useState('');
        
        const startListening = () => {
            if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
                setErrorMessage('Speech recognition is not supported in your browser.');
                return;
            }
            
            setErrorMessage('');
            setIsListening(true);
            
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';
            
            recognition.onstart = () => {
                console.log('Voice recognition started');
            };
            
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                onVoiceInput(transcript);
            };
            
            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setErrorMessage(`Error: ${event.error}`);
                setIsListening(false);
            };
            
            recognition.onend = () => {
                setIsListening(false);
            };
            
            recognition.start();
        };
        
        return (
            <div data-name="voice-input">
                <button
                    onClick={startListening}
                    disabled={isListening}
                    className={`p-2 sm:p-3 rounded-full ${
                        isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-100 text-blue-500 hover:bg-blue-200'
                    }`}
                    data-name="voice-input-button"
                >
                    <i className={`fas ${isListening ? 'fa-stop' : 'fa-microphone'} text-sm sm:text-base`}></i>
                </button>
                {errorMessage && (
                    <div className="text-red-500 text-xs sm:text-sm mt-1 absolute" data-name="voice-input-error">
                        {errorMessage}
                    </div>
                )}
            </div>
        );
    } catch (error) {
        console.error('VoiceInput component error:', error);
        reportError(error);
        return null;
    }
}
