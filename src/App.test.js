import { render, screen } from '@testing-library/react';
import App from './App';

test('renders header title', () => {
  render(<App />);
  const linkElement = screen.getByText(/SSR Editor/i); // Kontrollerar att din header finns
  expect(linkElement).toBeInTheDocument();
});