import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import GeoSort from './GeoSort';

test('sort by distance checkbox is disabled when locationPermission is false', () => {
  render(
    <GeoSort
      locationPermission={false}
      sortByDistance={false}
      handleSortToggleChange={() => {}}
      show={false}
      setShow={() => {}}
    />,
  );
  expect(screen.getByLabelText(/sort by distance/i)).toBeDisabled();
});

test('sort by distance checkbox is enabled and checked when locationPermission is true and sortByDistance is true', () => {
  render(
    <GeoSort
      locationPermission={true}
      sortByDistance={true}
      handleSortToggleChange={() => {}}
      show={false}
      setShow={() => {}}
    />,
  );

  expect(screen.getByLabelText(/sort by distance/i)).toBeEnabled();
  expect(screen.getByLabelText(/sort by distance/i)).toBeChecked();
});

test('alert is shown when show is true', () => {
  render(
    <GeoSort
      locationPermission={false}
      sortByDistance={false}
      handleSortToggleChange={() => {}}
      show={true}
      setShow={() => {}}
    />,
  );

  expect(screen.getByRole('alert')).toBeInTheDocument();
});

test('alert closes when close button is clicked', () => {
  const mockSetShow = jest.fn();

  render(
    <GeoSort
      locationPermission={false}
      sortByDistance={false}
      handleSortToggleChange={() => {}}
      show={true}
      setShow={mockSetShow}
    />,
  );

  fireEvent.click(screen.getByRole('button', { name: 'Close' }));
  expect(mockSetShow).toHaveBeenCalledWith(false);
});
