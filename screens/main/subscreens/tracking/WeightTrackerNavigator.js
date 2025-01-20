import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddWeight from './bodyWeightTracker/AddWeight';
import WeightTracker from './bodyWeightTracker/WeightTracker';

const Stack = createNativeStackNavigator();

function WeightTrackerNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WeightTracker" component={WeightTracker} />
      <Stack.Screen name="AddWeight" component={AddWeight} />
    </Stack.Navigator>
  )
}

export default WeightTrackerNavigator;