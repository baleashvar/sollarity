import React, { useState } from 'react';

const FeedbackWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setIsOpen(false);
          setSubmitted(false);
          setFeedback('');
          setEmail('');
        }, 2000);
      }
    } catch (error) {
      console.error('Feedback submission failed:', error);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
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
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full p-2 border rounded text-sm mb-3 h-20 resize-none"
                required
              />
              
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email (optional)"
                className="w-full p-2 border rounded text-sm mb-3"
              />
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700"
              >
                Send Feedback
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackWidget;