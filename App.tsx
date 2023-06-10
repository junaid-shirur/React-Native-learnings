import React from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
// import { PaperProvider } from 'react-native-paper';
import AsteroidForm from './components/Form';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsteroidDetails from './components/Asteroid';

export default function App() {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  return (
    // <PaperProvider>
    <View style={styles.container}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName='Home'>
            <Stack.Screen name="Home" component={AsteroidForm} />
            <Stack.Screen name="Asteroid" component={AsteroidDetails} initialParams={undefined} />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style='auto'/>
    </View>
    // </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
