import React, { useState } from 'react';

const FeedbackWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/feedback/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: email || 'Anonymous',
          email: email || 'anonymous@sollarity.xyz',
          subject: 'Privacy Page Feedback',
          message: feedback
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setIsOpen(false);
          setSubmitted(false);
          setFeedback('');
          setEmail('');
        }, 2000);
      } else {
        setError(data.message || 'Failed to submit feedback');
      }
    } catch (error) {
      console.error('Feedback submission failed:', error);
      setError('Connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-20 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors"
        >
          💬
        </button>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border w-80">
          {submitted ? (
            <div className="text-center">
              <div className="text-green-600 text-2xl mb-2">✓</div>
              <p className="text-sm">Thank you for your feedback!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold">Feedback</h3>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setError('');
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-2 py-1 rounded text-xs mb-3">
                  {error}
                </div>
              )}
              
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full p-2 border rounded text-sm mb-3 h-20 resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
                disabled={loading}
              />
              
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email (optional)"
                className="w-full p-2 border rounded text-sm mb-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                disabled={loading}
              />
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Feedback'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackWidget;