import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TrainingTracker from './trainingTracker/TrainingTracker';
import DayBreakdown from './trainingTracker/DayBreakdown';

const Stack = createNativeStackNavigator();

function TrainingTrackerNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TrainingTracker" component={TrainingTracker} />
      <Stack.Screen name="DayBreakdown" component={DayBreakdown} />
    </Stack.Navigator>
  )
}

export default TrainingTrackerNavigator;