function StudyHelperPage() {
    try {
        const [studyQuery, setStudyQuery] = React.useState('');
        const [studyResponse, setStudyResponse] = React.useState('');
        const [isLoading, setIsLoading] = React.useState(false);
        const [error, setError] = React.useState('');
        const [subject, setSubject] = React.useState('general');

        const subjects = [
            { id: 'general', name: 'General' },
            { id: 'math', name: 'Mathematics' },
            { id: 'science', name: 'Science' },
            { id: 'coding', name: 'Programming' },
            { id: 'history', name: 'History' },
            { id: 'language', name: 'Languages' }
        ];

        const handleStudyQuery = async (e) => {
            e.preventDefault();
            if (!studyQuery.trim() || isLoading) return;
            
            setIsLoading(true);
            setError('');
            
            try {
                const subjectContext = subject !== 'general' 
                    ? `focusing on the ${subjects.find(s => s.id === subject).name} subject area` 
                    : '';
                
                const studyPrompt = `As an educational tutor ${subjectContext}, please provide a clear, step-by-step explanation to the following question or problem: ${studyQuery}`;
                const response = await fetchGeminiResponse(studyPrompt);
                setStudyResponse(response);
            } catch (err) {
                console.error('Study helper query failed:', err);
                setError('Failed to get study assistance. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        return (
            <div className="p-4 max-w-4xl mx-auto" data-name="study-helper-page">
                <div className="mb-6" data-name="study-helper-header">
                    <h2 className="text-2xl font-bold text-gray-800">Study Helper</h2>
                    <p className="text-gray-600">Get step-by-step explanations for your academic questions</p>
                </div>
                
                <form onSubmit={handleStudyQuery} className="mb-6" data-name="study-helper-form">
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" data-name="subject-label">
                            Select Subject:
                        </label>
                        <select
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            data-name="subject-select"
                        >
                            {subjects.map(subj => (
                                <option key={subj.id} value={subj.id}>
                                    {subj.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="mb-4">
                        <textarea
                            value={studyQuery}
                            onChange={(e) => setStudyQuery(e.target.value)}
                            placeholder="Enter your question or problem..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows="4"
                            disabled={isLoading}
                            data-name="study-query-input"
                        ></textarea>
                    </div>
                    
                    <button
                        type="submit"
                        disabled={isLoading || !studyQuery.trim()}
                        className={`px-4 py-2 rounded-lg ${
                            isLoading || !studyQuery.trim()
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                        }`}
                        data-name="get-explanation-button"
                    >
                        {isLoading ? (
                            <span className="flex items-center">
                                <i className="fas fa-spinner fa-spin mr-2"></i> Thinking...
                            </span>
                        ) : (
                            <span className="flex items-center">
                                <i className="fas fa-graduation-cap mr-2"></i> Get Explanation
                            </span>
                        )}
                    </button>
                </form>
                
                {error && (
                    <div className="p-3 bg-red-100 text-red-700 rounded-lg" data-name="study-error">
                        {error}
                    </div>
                )}
                
                {studyResponse && !error && (
                    <div className="mt-6" data-name="study-response">
                        <h3 className="text-lg font-semibold mb-2">Explanation:</h3>
                        <div className="p-4 bg-gray-100 rounded-lg whitespace-pre-wrap border-l-4 border-yellow-500">
                            {studyResponse}
                        </div>
                    </div>
                )}
            </div>
        );
    } catch (error) {
        console.error('StudyHelperPage component error:', error);
        reportError(error);
        return null;
    }
}
