import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

// describe(App, () => {
//   it("counter displays correct initial count", () => {
//     const { getAllByTestId } = render(<App />);
//     const countvalue = getByTestId("count").textContent;
//     expect(countvalue).toEqual("0");
//   });
// });
