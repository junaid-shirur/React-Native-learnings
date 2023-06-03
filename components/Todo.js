import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Todo = ({ label, onEditPress, onDeletePress }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={onEditPress}>
                    <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={onDeletePress}>
                    <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        maxWidth: 295,
        marginHorizontal: 4,
        justifyContent: "space-around",
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        gap:5,
        elevation: 2,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        maxWidth: 120
    },
    button: {
        flex: 1,
        backgroundColor: '#2196F3',
        borderRadius: 4,
        padding: 2,
        marginHorizontal: 2,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default Todo;
