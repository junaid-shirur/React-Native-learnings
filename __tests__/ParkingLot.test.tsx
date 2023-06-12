import React from 'react';
import { Alert } from 'react-native'
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import ParkingLot from '../components/ParkingLot';
import { ParkedCar } from '../components/types';

describe('ParkingLot', () => {

    test('renders parking form when no parking spaces are available', () => {
        const { getByPlaceholderText, getByText } = render(<ParkingLot />);
        const input = getByPlaceholderText('Enter number of parking spaces');
        const submitButton = getByText('Submit');

        expect(input).toBeDefined();
        expect(submitButton).toBeDefined();
    });

    test('submits parking form and initializes parking spaces', async () => {
        const { getByPlaceholderText, getByText, getAllByTestId, getByRole } = render(<ParkingLot />);
        const input = getByPlaceholderText('Enter number of parking spaces');
        const submitButton = getByRole('button', { name: 'Submit' });

        fireEvent.changeText(input, '5');
        await act(async () => {
            fireEvent.press(submitButton);

            await waitFor(() => {
                expect(getByText('Car Arrive')).toBeDefined();
                const parkingSpaces = getAllByTestId('parking_spaces');
                expect(parkingSpaces.length).toBe(5);
            });
        })

    });

    test('registers a new car and updates the parking spaces', async () => {
        const { getByPlaceholderText, getByText, getAllByTestId, getByRole, getByTestId } = render(<ParkingLot />);

        const input = getByPlaceholderText('Enter number of parking spaces');
        const submitButton = getByRole('button', { name: 'Submit' });

        fireEvent.changeText(input, '5');

        await act(async () => {
            fireEvent.press(submitButton)

            await waitFor(async () => {
                const carArriveButton = getByRole('button', { name: "Car Arrive" });
                await act(() => {
                    fireEvent.press(carArriveButton);
                })
                const modal = getAllByTestId("Modal")
                expect(modal).toBeDefined()
            })
        })

        // when car parked
        const modalInput = getByTestId("modalInput")
        const submitModalBtn = getByRole('button', { name: "Submit" })
        fireEvent.changeText(modalInput, 'ABC123');
        await act(async () => {
            fireEvent.press(submitModalBtn);
            await waitFor(() => {
                expect(getByText("ABC123")).toBeDefined()
            })
        })

    });

    test('shows payment modal when car is clicked', async () => {
        const { getByText, getAllByTestId, getByPlaceholderText, getByRole, getByTestId } = render(<ParkingLot />);

        await act(async () => {
            await waitFor(() => {
                fireEvent.changeText(getByPlaceholderText('Enter number of parking spaces'), '5');
                fireEvent.press(getByRole('button', { name: 'Submit' }));
                fireEvent.press(getByRole('button', { name: "Car Arrive" }));
                fireEvent.changeText(getByTestId("modalInput"), 'ABC123');
                fireEvent.press(getByRole('button', { name: "Submit" }));
                expect(getByText("ABC123")).toBeDefined();
            })
        });

        await act(async () => {
            fireEvent.press(getByText("ABC123"));

            await waitFor(() => {
                const modal = getAllByTestId("Modal");
                expect(modal).toBeDefined();
                expect(getByText("Make a Payment")).toBeDefined();
            });
        });
    });

    test('submit payment', async () => {
        const { getByText, getAllByTestId, getByPlaceholderText, getByRole, getByTestId } = render(<ParkingLot />);

        jest.spyOn(Alert, 'alert');
        jest.spyOn(global, "fetch").mockResolvedValueOnce({
            status: 200,
        } as any);

        let data = {
            carRegistration: "ABC123",
            charge: 10
        };
        await act(async () => {
            await waitFor(() => {
                fireEvent.changeText(getByPlaceholderText('Enter number of parking spaces'), '5');
                fireEvent.press(getByRole('button', { name: 'Submit' }));
                fireEvent.press(getByRole('button', { name: "Car Arrive" }));
                fireEvent.changeText(getByTestId("modalInput"), 'ABC123');
                fireEvent.press(getByRole('button', { name: "Submit" }));
                fireEvent.press(getByText("ABC123"));
            })
        });

        await act(async () => {
            fireEvent.press(getByRole('button', { name: '$10 payment' }));

            await waitFor(() => {
                expect(global.fetch).toHaveBeenCalledWith(
                    "https://httpstat.us/200",
                    expect.objectContaining({
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    })
                );
                expect(Alert.alert).toHaveBeenCalledWith("Payment succed");
            });
        });
    });
    // Add more test cases as needed

});
