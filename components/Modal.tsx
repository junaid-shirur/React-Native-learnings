import React, { useState } from 'react';
import { View, Modal, Text, Button, StyleSheet, TextInput } from 'react-native';

export interface ParkingSpacesModalProps {
    isVisible: boolean
    label?: string
    submitText?: string
    inputVal?: string
    readOnly?: boolean
    heading: string
    hideModal: () => void
    onInputChange?: (e: string) => void
    onSubmit: () => void
}
const CustomModal: React.FC<ParkingSpacesModalProps> = (props) => {

    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={props.isVisible}
                onRequestClose={() => props.hideModal()}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalHeader}>{props.heading}</Text>
                        <TextInput
                            style={styles.modalText}
                            value={props.inputVal}
                            // editable={props.readOnly}
                            onChangeText={(text) => {
                                if (props.onInputChange)
                                    props.onInputChange(text)
                            }}
                        />
                        <View style={styles.buttonContainer}>
                            <Button
                                title={props.submitText || ""}
                                onPress={() => props.onSubmit()}
                            />
                            <Button
                                title="Cancel"
                                onPress={() => props.hideModal()}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    modalHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
        borderColor: 'gray',
        minWidth: 90,
        borderWidth: 1
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 6,
        width: '100%',
    },
});

export default CustomModal;
