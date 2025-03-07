function SecurityPage() {
    try {
        const [securityQuery, setSecurityQuery] = React.useState('');
        const [securityResponse, setSecurityResponse] = React.useState('');
        const [isLoading, setIsLoading] = React.useState(false);
        const [error, setError] = React.useState('');

        const handleSecurityCheck = async (e) => {
            e.preventDefault();
            if (!securityQuery.trim() || isLoading) return;
            
            setIsLoading(true);
            setError('');
            
            try {
                const securityPrompt = `As a cybersecurity expert, please analyze the following security concern or question and provide professional advice: ${securityQuery}`;
                const response = await fetchGeminiResponse(securityPrompt);
                setSecurityResponse(response);
            } catch (err) {
                console.error('Security check failed:', err);
                setError('Failed to perform security analysis. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        return (
            <div className="p-4 max-w-4xl mx-auto" data-name="security-page">
                <div className="mb-6" data-name="security-header">
                    <h2 className="text-2xl font-bold text-gray-800">Cybersecurity Assistant</h2>
                    <p className="text-gray-600">Get expert security advice and threat analysis</p>
                </div>
                
                <form onSubmit={handleSecurityCheck} className="mb-6" data-name="security-form">
                    <div className="mb-4">
                        <textarea
                            value={securityQuery}
                            onChange={(e) => setSecurityQuery(e.target.value)}
                            placeholder="Describe your security concern or ask a cybersecurity question..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows="4"
                            disabled={isLoading}
                            data-name="security-query-input"
                        ></textarea>
                    </div>
                    
                    <button
                        type="submit"
                        disabled={isLoading || !securityQuery.trim()}
                        className={`px-4 py-2 rounded-lg ${
                            isLoading || !securityQuery.trim()
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                        data-name="analyze-security-button"
                    >
                        {isLoading ? (
                            <span className="flex items-center">
                                <i className="fas fa-spinner fa-spin mr-2"></i> Analyzing...
                            </span>
                        ) : (
                            <span className="flex items-center">
                                <i className="fas fa-shield-alt mr-2"></i> Analyze Security
                            </span>
                        )}
                    </button>
                </form>
                
                {error && (
                    <div className="p-3 bg-red-100 text-red-700 rounded-lg" data-name="security-error">
                        {error}
                    </div>
                )}
                
                {securityResponse && !error && (
                    <div className="mt-6" data-name="security-response">
                        <h3 className="text-lg font-semibold mb-2">Security Analysis:</h3>
                        <div className="p-4 bg-gray-100 rounded-lg whitespace-pre-wrap border-l-4 border-green-500">
                            {securityResponse}
                        </div>
                    </div>
                )}
            </div>
        );
    } catch (error) {
        console.error('SecurityPage component error:', error);
        reportError(error);
        return null;
    }
}
