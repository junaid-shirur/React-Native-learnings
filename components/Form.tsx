import React, { useState } from 'react'
import { View, StyleSheet, Text } from 'react-native';
import { TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { api_key } from '../constants';


interface AsteroidFormProps {
    navigation: any
}
const AsteroidForm: React.FC<AsteroidFormProps> = ({ navigation }) => {
    const [state, setState] = useState<FormState>({
        isSubmitting: false,
        error: false,
        asteroidId: ""
    })
    const handleRandomAsteroid = async () => {
        try {
            setState(s => ({ ...s, isSubmitting: true }))
            const response = await fetch(
                `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${api_key}`
            );
            const data = await response.json();
            const randomAsteroid = data.near_earth_objects[Math.floor(Math.random() * data.near_earth_objects.length)];
            setState(s => ({
                ...s, asteroidId: randomAsteroid.neo_reference_id
            }))
            const asteroid = {
                id: randomAsteroid.neo_reference_id,
                name: randomAsteroid.name,
                is_potentially_hazardous_asteroid: randomAsteroid.is_potentially_hazardous_asteroid,
                close_approach_date: randomAsteroid.close_approach_data[0].close_approach_date,
                miss_distance_km: randomAsteroid.close_approach_data[0].miss_distance.kilometers,
            }
            navigation.navigate("Asteroid", { asteroid })
        } catch (error) {
            console.error('ERROR FETCH ASTEROIDS', error)
            setState(s => ({ ...s, error: true }))
        } finally {
            setState(s => ({ ...s, isSubmitting: false }))
        }
    };
    const handleSubmit = async () => {
        try {
            setState(s => ({ ...s, isSubmitting: true }))
            const asteroidResponse = await fetch(
                `https://api.nasa.gov/neo/rest/v1/neo/${state.asteroidId}?api_key=${api_key}`
            );
            const asteroidData = await asteroidResponse.json();
            const asteroid = {
                id: asteroidData.neo_reference_id,
                name: asteroidData.name,
                is_potentially_hazardous_asteroid: asteroidData.is_potentially_hazardous_asteroid,
                close_approach_date: asteroidData.close_approach_data[0].close_approach_date,
                miss_distance_km: asteroidData.close_approach_data[0].miss_distance.kilometers,
            }
            navigation.navigate("Asteroid", { asteroid })
        } catch (error) {
            console.error("Error Getting Asteroid", error)
            setState(s => ({ ...s, error: true }))
        } finally {
            setState(s => ({ ...s, isSubmitting: false }))
        }
    };
    if(state.error) return <><Text>Something went wrong</Text></>
    return (
        <View style={styles.container}>
            <TextInput
                label="Asteroid ID"
                mode="outlined"
                value={state.asteroidId}
                style={{ minWidth: 190 }}
                onChangeText={text => setState(s => ({ ...s, asteroidId: text }))}
            />
            <Button
                mode="contained"
                disabled={state.isSubmitting}
                onPress={handleSubmit}
            >
                Submit
            </Button>
            <Button
                mode="contained"
                disabled={state.isSubmitting}
                onPress={handleRandomAsteroid}
            >
                Random Asteroid
            </Button>
            {state.isSubmitting ? <ActivityIndicator animating={true} size="small" /> : null}
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8
    },
});
export default AsteroidForm