import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('counter displays correct initial count', () => {
    const { getAllByTestId } = render(<App />);
    const countElement = getAllByTestId('count')[0];
    const countValue = Number(countElement.textContent);
    expect(countValue).toEqual(1);
  });
});

// test("2nd demo test", () =>{
//   const mockProps = {
//     locationPermission: false,
//     sortByDistance: false,
//     handleSortToggleChange: () => {},
//     show: boolean,
//     setShow: (toShow: boolean) => void;
//   }
//   render(<GeoSort />);
//   expect(cloudSelected[0])
// })
