import React from 'react';
import { render, fireEvent, act, waitFor, cleanup } from '@testing-library/react-native';
import AsteroidForm from '../components/Form';
import { api_key } from '../constants';

describe('AsteroidForm', () => {

    const mockAsteroidData = {
        near_earth_objects: [{
            id: "12345",
            name: "Sample Asteroid",
            is_potentially_hazardous_asteroid: true,
            close_approach_data: [{ close_approach_date: "12-12-12", miss_distance: { kilometers: 1000 }}],
            miss_distance_km: 10000,
        }]
    };

    it('renders the form correctly', () => {
        const { getByText, getByPlaceholderText } = render(<AsteroidForm />);

        const asteroidIdInput = getByText('Asteroid Id');
        const submitButton = getByText('Submit');
        const randomAsteroidButton = getByText('RandomAsteroid');

        expect(asteroidIdInput).toBeTruthy();
        expect(submitButton).toBeTruthy();
        expect(randomAsteroidButton).toBeTruthy();
    });

    it('updates the asteroidId state when the input value changes', () => {
        const { getByPlaceholderText, getByTestId } = render(<AsteroidForm />);

        const asteroidIdInput = getByTestId('textInput');

        fireEvent.changeText(asteroidIdInput, '12345');

        expect(asteroidIdInput.props.value).toBe('12345');
    });

    it('calls handleSubmit function when submit button is pressed', async () => {
        const props = {
            navigation: {
                navigate: jest.fn()
            }
        }
        jest.spyOn(global, "fetch").mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce(mockAsteroidData.near_earth_objects[0]),
        } as any);
        const { getByTestId, getByRole } = render(<AsteroidForm {...props} />);

        const asteroidIdInput = getByTestId('textInput');
        const submitButton = getByRole("button", { name: "Submit" });

        fireEvent.changeText(asteroidIdInput, '12345');
        expect(asteroidIdInput.props.value).toBe("12345");

        fireEvent.press(submitButton);
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                `https://api.nasa.gov/neo/rest/v1/neo/12345?api_key=${api_key}`
                );
            expect(submitButton.props.accessibilityState.disabled).toBeTruthy()

        });

    });


    it('calls handleRandomAsteroid function when randomAsteroid button is pressed', async () => {
        const props = {
            navigation: {
                navigate: jest.fn()
            }
        }
        jest.spyOn(global, "fetch").mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce(mockAsteroidData),
        } as any);
        const { getByTestId, getByRole } = render(<AsteroidForm {...props} />);

        const getRandomAsteroidBtn = getByRole("button", { name: "RandomAsteroid" });
        
        fireEvent.press(getRandomAsteroidBtn);
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${api_key}`
            );
            expect(getRandomAsteroidBtn.props.accessibilityState.disabled).toBeTruthy()
        });
    });

    it("shows error when submit fails", async () => {
        const defaultErrMsg = "Something went wrong!"
        const { getByTestId, getByRole } = render(<AsteroidForm />);
        jest.spyOn(global, "fetch").mockRejectedValueOnce({
            json: jest.fn().mockRejectedValueOnce(defaultErrMsg),
        } as any);
        const asteroidIdInput = getByTestId('textInput');

        fireEvent.changeText(asteroidIdInput, '12345');
        expect(asteroidIdInput.props.value).toBe("12345");
        const submitBtn = getByRole("button", { name: "Submit" });
        fireEvent.press(submitBtn)
        waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                `https://api.nasa.gov/neo/rest/v1/neo/12345?api_key=${api_key}`);
            expect(getByTestId("Error_render")).toBeTruthy()
        })
    })
});
