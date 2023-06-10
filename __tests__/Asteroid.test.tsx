import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native'
import AsteroidDetails from "../components/Asteroid";
// import renderer from 'react-test-renderer'


describe('AsteroidDetails', () => {
    it('renders the asteroid details correctly', () => {
        const asteroid = {
            id: '123',
            name: 'Sample Asteroid',
            is_potentially_hazardous_asteroid: false,
            close_approach_date: '2023-06-01',
            miss_distance_km: '10000',
        };
        const route = {
            key: "",
            name: 'Asteroid',
            params: {
                asteroid: asteroid,
            },
        };

        const { getByText } = render(<AsteroidDetails route={route} />);

        expect(getByText('Sample Asteroid')).toBeTruthy();
        expect(getByText('ID: 123')).toBeTruthy();
        expect(getByText('Potentially Hazardous: No')).toBeTruthy();
        expect(getByText('Close Approach Date: 2023-06-01')).toBeTruthy();
        expect(getByText('Miss Distance (km): 10000')).toBeTruthy();
    });

    it('renders an error message if the asteroid data is missing', () => {
        const route = {
            name: 'Asteroid',
            params: {},
            asteroid:{}
        };

        const { getByText } = render(<AsteroidDetails route={route} />);

        expect(getByText('Something went wrong')).toBeTruthy();
    });
});