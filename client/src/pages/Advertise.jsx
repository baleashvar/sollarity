import React, { useState } from 'react';

const Advertise = () => {
  const [formData, setFormData] = useState({
    contactName: '',
    email: '',
    website: '',
    companyName: '',
    budget: '',
    advertText: '',
    comments: '',
    adFile: null
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const budgetOptions = [
    '$100 - $500',
    '$500 - $1,000',
    '$1,000 - $5,000',
    '$5,000 - $10,000',
    '$10,000+'
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        e.target.value = ''; // Clear the input
        return;
      }
      setError(''); // Clear any previous errors
    }
    setFormData({...formData, adFile: file});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response;
      
      if (formData.adFile) {
        // If file is present, use FormData
        const submitData = new FormData();
        Object.keys(formData).forEach(key => {
          if (key === 'adFile' && formData[key]) {
            submitData.append('adFile', formData[key]);
          } else if (key !== 'adFile') {
            submitData.append(key, formData[key]);
          }
        });
        
        response = await fetch(`${process.env.REACT_APP_API_URL || 'https://api.sollarity.xyz'}/advertising/submit`, {
          method: 'POST',
          body: submitData
        });
      } else {
        // If no file, send as JSON
        const { adFile, ...dataWithoutFile } = formData;
        response = await fetch(`${process.env.REACT_APP_API_URL || 'https://api.sollarity.xyz'}/advertising/submit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dataWithoutFile)
        });
      }

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({
          contactName: '',
          email: '',
          website: '',
          companyName: '',
          budget: '',
          advertText: '',
          comments: '',
          adFile: null
        });
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to submit advertising request');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-8 text-center">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">
            Request Submitted!
          </h2>
          <p className="text-green-700 dark:text-green-300 mb-4">
            Thank you for your advertising inquiry. We'll review your request and get back to you within 24 hours.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Advertise with Sollarity
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Reach thousands of crypto enthusiasts and memecoin traders
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl mb-2">👥</div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Active Users</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">10,000+ monthly visitors</p>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Targeted Audience</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Crypto & DeFi focused</p>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-2xl mb-2">📈</div>
            <h3 className="font-semibold text-gray-900 dark:text-white">High Engagement</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Premium user base</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contact Name *
              </label>
              <input
                type="text"
                required
                value={formData.contactName}
                onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g. John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g. johndoe@popcat.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Official Website URL *
            </label>
            <input
              type="url"
              required
              value={formData.website}
              onChange={(e) => setFormData({...formData, website: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g. https://popcat.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Company Name/Project Name *
            </label>
            <input
              type="text"
              required
              value={formData.companyName}
              onChange={(e) => setFormData({...formData, companyName: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g. Popcat"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Advertising Budget *
            </label>
            <select
              required
              value={formData.budget}
              onChange={(e) => setFormData({...formData, budget: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Choose budget range</option>
              {budgetOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Advert Text to Display *
            </label>
            <textarea
              required
              rows="4"
              value={formData.advertText}
              onChange={(e) => setFormData({...formData, advertText: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Your advert text..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload Advertisement (Optional)
            </label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <p className="text-xs text-gray-500 mt-1">Supported formats: JPG, PNG, PDF (Max 5MB)</p>
            <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                <strong>Note:</strong> If upload fails, try uploading a smaller image or submit without uploading an image. You can always send files via email later.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Comments/Questions
            </label>
            <textarea
              rows="3"
              value={formData.comments}
              onChange={(e) => setFormData({...formData, comments: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Any additional information or questions..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 font-medium"
          >
            {loading ? 'Submitting...' : 'Submit Advertising Request'}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Why Advertise with Sollarity?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Targeted Reach</h4>
              <p>Connect with active crypto traders and memecoin enthusiasts who are actively looking for new opportunities.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Premium Placement</h4>
              <p>Your ads will be displayed prominently across our platform with high visibility and engagement rates.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Flexible Options</h4>
              <p>Choose from various advertising formats and budget ranges to suit your marketing needs.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Quick Response</h4>
              <p>Get a response within 24 hours and start your campaign quickly with our streamlined process.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advertise;