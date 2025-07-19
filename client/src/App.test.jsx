import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Sollarity text', () => {
  render(<App />);
  const linkElement = screen.getByText(/Sollarity/i);
  expect(linkElement).toBeInTheDocument();
});