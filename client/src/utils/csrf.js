// CSRF token management for client-side
let csrfToken = null;

export const getCSRFToken = async () => {
  if (csrfToken) return csrfToken;
  
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/csrf-token`, {
      credentials: 'include'
    });
    const data = await response.json();
    csrfToken = data.csrfToken;
    return csrfToken;
  } catch (error) {
    console.error('Failed to get CSRF token:', error);
    return null;
  }
};

export const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = await getCSRFToken();
  const authToken = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (token) {
    headers['X-CSRF-Token'] = token;
  }
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  return fetch(url, {
    ...options,
    headers,
    credentials: 'include'
  });
};