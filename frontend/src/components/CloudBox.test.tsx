import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import CloudBox from './CloudBox';

test('displays the correct cloud information', () => {
  const cloud_demo = {
    cloud_id: 1,
    cloud_name: 'Test Cloud',
    cloud_description: 'A cloud for testing',
    geo_latitude: 10,
    geo_longitude: 20,
    geo_region: 'Test Region',
    provider: 'aws',
    provider_description: 'A provider for testing',
  };

  render(<CloudBox cloud={cloud_demo} selected={false} handleCardClick={() => {}} />);

  expect(screen.getByText('Test Cloud')).toBeInTheDocument();
  expect(screen.getByText('A cloud for testing')).toBeInTheDocument();
  expect(screen.getByText('Latitude: 10')).toBeInTheDocument();
  expect(screen.getByText('Longitude: 20')).toBeInTheDocument();
  expect(screen.getByText('Region: Test Region')).toBeInTheDocument();
  expect(screen.getByText('Provider: aws')).toBeInTheDocument();
  expect(screen.getByText('Provider Description: A provider for testing')).toBeInTheDocument();
});

test('adds selected class to card when selected is true', () => {
  const cloud = {
    cloud_id: 2,
    cloud_name: 'Selected Cloud',
    cloud_description: 'A selected cloud',
    geo_latitude: 50,
    geo_longitude: 60,
    geo_region: 'Selected Region',
    provider: 'aws',
    provider_description: 'Provider description',
  };

  render(<CloudBox cloud={cloud} selected={true} handleCardClick={() => {}} />);

  const card = screen.getByText('Selected Cloud').closest('.card');
  expect(card).toHaveClass('selected');
});

test('calls handleCardClick with correct cloudId on card click', () => {
  const cloud = {
    cloud_id: 1,
    cloud_name: 'Clickable Cloud',
    cloud_description: 'A cloud that should be clickable',
    geo_latitude: 30,
    geo_longitude: 40,
    geo_region: 'Clickable Region',
    provider: 'Clickable Provider',
    provider_description: 'A provider that is clickable',
  };

  const handleCardClick = jest.fn();
  render(<CloudBox cloud={cloud} selected={false} handleCardClick={handleCardClick} />);

  const card = screen.getByTestId(`cloud-card-${cloud.cloud_id}`);
  userEvent.click(card);

  expect(handleCardClick).toHaveBeenCalledWith(1);
});
