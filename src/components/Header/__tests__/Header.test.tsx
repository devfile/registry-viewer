import { render, screen, cleanup } from '@testing-library/react';
import { Header } from '../Header';
import { expect, test } from '@jest/globals';

afterEach(() => {
  cleanup();
});

test('Should render Header component', () => {
  render(<Header />);
  const headerElement = screen.getByTestId('component-header');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (expect(headerElement) as any).toBeInTheDocument();
});
