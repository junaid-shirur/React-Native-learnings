import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// interface AsteroidDetailsProps extends NativeStackScreenProps<{ Asteroid: { asteroid: Asteroid } }, "Asteroid", "Asteroid"> {

// }

interface AsteroidDetailsProps {
    route: any
}
const AsteroidDetails: React.FC<AsteroidDetailsProps> = ({ route }) => {
    const { asteroid } = route.params
    if (route.name !== 'Asteroid' || !asteroid?.id) {
        return <><Text>Something went wrong</Text></>
    }
    return (
        <>
            <View style={styles.asteroidDetails}>
                <Text style={styles.heading}>{asteroid.name}</Text>
                <Text>ID: {asteroid.id}</Text>
                <Text>
                    Potentially Hazardous:{" "}
                    {asteroid.is_potentially_hazardous_asteroid ? "Yes" : "No"}
                </Text>
                <Text>Close Approach Date: {asteroid.close_approach_date}</Text>
                <Text>Miss Distance (km): {asteroid.miss_distance_km}</Text>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    asteroidDetails: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heading: {
        fontSize: 25,
        fontWeight: "bold",
    },
});

export default AsteroidDetails;
