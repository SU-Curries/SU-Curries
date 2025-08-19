import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders SU Curries app', () => {
  render(<App />);
  const appTitle = screen.getByText(/SU Curries/i);
  expect(appTitle).toBeInTheDocument();
  
  const tagline = screen.getByText(/Authentic Indian Flavors/i);
  expect(tagline).toBeInTheDocument();
});
