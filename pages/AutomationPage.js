function AutomationPage() {
    try {
        const [automationTask, setAutomationTask] = React.useState('');
        const [automationResponse, setAutomationResponse] = React.useState('');
        const [isLoading, setIsLoading] = React.useState(false);
        const [error, setError] = React.useState('');

        const handleAutomationRequest = async (e) => {
            e.preventDefault();
            if (!automationTask.trim() || isLoading) return;
            
            setIsLoading(true);
            setError('');
            
            try {
                const automationPrompt = `As an automation expert, please provide guidance on how to automate the following task: ${automationTask}. Include steps, potential tools, and code examples if relevant.`;
                const response = await fetchGeminiResponse(automationPrompt);
                setAutomationResponse(response);
            } catch (err) {
                console.error('Automation request failed:', err);
                setError('Failed to get automation guidance. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        return (
            <div className="p-4 max-w-4xl mx-auto" data-name="automation-page">
                <div className="mb-6" data-name="automation-header">
                    <h2 className="text-2xl font-bold text-gray-800">Automation Assistant</h2>
                    <p className="text-gray-600">Get expert guidance on automating repetitive tasks</p>
                </div>
                
                <form onSubmit={handleAutomationRequest} className="mb-6" data-name="automation-form">
                    <div className="mb-4">
                        <textarea
                            value={automationTask}
                            onChange={(e) => setAutomationTask(e.target.value)}
                            placeholder="Describe the task you want to automate..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows="4"
                            disabled={isLoading}
                            data-name="automation-task-input"
                        ></textarea>
                    </div>
                    
                    <button
                        type="submit"
                        disabled={isLoading || !automationTask.trim()}
                        className={`px-4 py-2 rounded-lg ${
                            isLoading || !automationTask.trim()
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                        data-name="get-automation-help-button"
                    >
                        {isLoading ? (
                            <span className="flex items-center">
                                <i className="fas fa-spinner fa-spin mr-2"></i> Processing...
                            </span>
                        ) : (
                            <span className="flex items-center">
                                <i className="fas fa-robot mr-2"></i> Get Automation Help
                            </span>
                        )}
                    </button>
                </form>
                
                {error && (
                    <div className="p-3 bg-red-100 text-red-700 rounded-lg" data-name="automation-error">
                        {error}
                    </div>
                )}
                
                {automationResponse && !error && (
                    <div className="mt-6" data-name="automation-response">
                        <h3 className="text-lg font-semibold mb-2">Automation Solution:</h3>
                        <div className="p-4 bg-gray-100 rounded-lg whitespace-pre-wrap border-l-4 border-indigo-500">
                            {automationResponse}
                        </div>
                    </div>
                )}
            </div>
        );
    } catch (error) {
        console.error('AutomationPage component error:', error);
        reportError(error);
        return null;
    }
}
