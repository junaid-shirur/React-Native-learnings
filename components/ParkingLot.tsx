import React from 'react';
import { View, TextInput, Button, StyleSheet, Pressable, Text, ScrollView, SafeAreaView, Alert, Platform, StatusBar } from 'react-native';
import { ParkedCar } from './types';
import CustomModal, { ParkingSpacesModalProps } from './Modal';


interface ParkingLotProps {

}
type ParkingState = {
    isModalVisible: boolean
    parkingSpaceCount: number;
    parkingSpaceFormValue: string;
    parkingSpaces: Array<ParkedCar>;
    parkingRegCarValue: string;
    exitParking: Partial<ParkedCar & {
        paymentModal: boolean,
        paymentTocollect: number;
    }>;
}
class ParkingLot extends React.Component<ParkingLotProps, ParkingState>{
    constructor(props: ParkingLotProps) {
        super(props)
        this.state = {
            isModalVisible: false,
            parkingSpaceFormValue: "",
            parkingRegCarValue: "",
            parkingSpaceCount: 0,
            parkingSpaces: [],
            exitParking: {
                id: 0,
                carReg: "",
                Ptime: 0,
                paymentModal: false,
                paymentTocollect: 0
            },
        }
    }

    handleParkingFormSubmit = () => {
        let PLotSpaces = Array.from({ length: parseInt(this.state.parkingSpaceFormValue) }, (_, i) => i + 1)
        this.setState((s) => ({
            ...s,
            parkingSpaceCount: parseInt(this.state.parkingSpaceFormValue),
            parkingSpaces: PLotSpaces.map(i => ({ id: i, carReg: "", Ptime: 0 }))
        }))
    }

    handleNewCarParked = () => {
        const { parkingSpaces, parkingRegCarValue } = this.state;

        const emptyLots = parkingSpaces.filter(itm => !itm.carReg);
        if (emptyLots.length === 0) {
            Alert.alert("Parking Full")
            return;
        }

        const duplicateCar = parkingSpaces.some(itm => itm.carReg === parkingRegCarValue)
        if (duplicateCar) return Alert.alert("Car with registered number already exists")

        const getRandomEmptyLot = emptyLots[Math.floor(Math.random() * emptyLots.length)];
        const updatedParkingSpaces = parkingSpaces.map(item =>
            item.id === getRandomEmptyLot.id
                ? { ...item, carReg: parkingRegCarValue, Ptime: Date.now() }
                : item
        );
        this.setState({
            parkingRegCarValue: "",
            parkingSpaces: updatedParkingSpaces,
            isModalVisible: !this.state.isModalVisible,
        });
    };

    showPaymentOnExit = (PCar: ParkedCar) => {
        const PARKING_CHARGE_RATE = 10;
        const calculateCharge = (Ptime: number) => {
            const now = Date.now();
            const diffMs = now - Ptime;
            const diffHours = diffMs / (1000 * 60 * 60);

            let charge = 0;
            if (diffHours <= 2) {
                charge = PARKING_CHARGE_RATE;
            } else {
                charge = (Math.ceil(diffHours) - 1) * PARKING_CHARGE_RATE;
            }
            return charge;
        };
        this.setState((s) => ({
            ...s,
            isModalVisible: !s.isModalVisible,
            exitParking: {
                ...PCar,
                paymentTocollect: calculateCharge(PCar.Ptime),
                paymentModal: true
            }
        }))
    };

    submitPayment = async () => {
        let data = {
            carRegistration: this.state.exitParking.carReg,
            charge: this.state.exitParking.paymentTocollect
        };
        try {
            const payment = await fetch("https://httpstat.us/200", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })
            if(payment.status == 200){
                Alert.alert("Payment succed")
                const updatedParkingSpaces = this.state.parkingSpaces.map(item =>
                    item.id === this.state.exitParking.id
                        ? { ...item, carReg: "", Ptime: 0 }
                        : item
                );
                this.setState(s => ({
                    ...s,
                    parkingSpaces: updatedParkingSpaces,
                    exitParking: {},
                    isModalVisible: !s.isModalVisible
                }))
            } else {
                Alert.alert("Unable to submit payment please try again")
            }
        } catch (error) {
            console.log(error,"error")
        }
        
    }
    render(): React.ReactNode {
        const { parkingSpaceFormValue, parkingSpaceCount, parkingSpaces, isModalVisible, exitParking } = this.state
        return (
            <View style={styles.container}>
                {!parkingSpaceCount ?
                    <View>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter number of parking spaces"
                            keyboardType="numeric"
                            value={parkingSpaceFormValue}
                            onChangeText={(text) => this.setState({ parkingSpaceFormValue: text })}
                        />
                        <Button disabled={!parkingSpaceFormValue} title="Submit" onPress={this.handleParkingFormSubmit} />
                    </View> :
                    <SafeAreaView style={{flex: 1}}>
                        <ScrollView contentContainerStyle={styles.scrollContainer}>
                            <Button title="Car Arrive" onPress={() => this.setState({
                                isModalVisible: !this.state.isModalVisible,
                                exitParking: { paymentModal: false }
                            })} />
                            <View style={styles.spaceContainer}>
                                {parkingSpaces.length > 0 && parkingSpaces.map((item, idx) => (
                                    <View style={styles.tile} key={idx} testID='parking_spaces'>
                                        <Pressable
                                            onPress={() => item.carReg ? this.showPaymentOnExit(item) : null}
                                        >
                                            <Text style={styles.tileText}>{item.carReg ? item.carReg : item.id}</Text>
                                        </Pressable>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    </SafeAreaView>
                }
                {this.state.isModalVisible && <CustomModal
                    isVisible={isModalVisible}
                    hideModal={() => this.setState({ isModalVisible: false })}
                    {
                    ...(exitParking.paymentModal ? {
                        heading: "Make a Payment",
                        submitText: `$${exitParking.paymentTocollect} payment`,
                        label: "Payment",
                        inputVal: `${exitParking.paymentTocollect}`,
                        onSubmit: this.submitPayment,
                        readOnly: !!exitParking.paymentModal
                    } : {
                        heading: "Register the Car",
                        submitText: "Submit",
                        label: "Enter Car Reg number",
                        onInputChange: (text: string) => this.setState((s) => ({ ...s, parkingRegCarValue: text })),
                        inputVal: this.state.parkingRegCarValue,
                        onSubmit: this.handleNewCarParked,
                        readOnly: false
                    })
                    }
                />}
            </View>
        );
    }
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    spaceContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 25,
    },
    tile: {
        width: '48%',
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightgray',
        marginBottom: 10,
    },
    tileText: {
        fontSize: 20,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    }
});

export default ParkingLot;
