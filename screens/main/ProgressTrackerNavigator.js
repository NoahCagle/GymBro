import { View } from 'react-native'
import React from 'react'
import { globalStyles } from '../../styles/styles';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddWeight from './subscreens/progress/AddWeight';
import WeightTracker from './subscreens/progress/WeightTracker';
import WorkoutTracker from './subscreens/progress/WorkoutTracker';
import DayBreakdown from './subscreens/progress/DayBreakdown';

const Stack = createNativeStackNavigator();

function ProgressTracker({ navigation }) {
  return (
    <View style={globalStyles.container}>
      <WorkoutTracker navigation={navigation} embedded={true} />
      <WeightTracker navigation={navigation} embedded={true} />
    </View>
  )
}

function ProgressTrackerNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProgressTracker" component={ProgressTracker} />
      <Stack.Screen name="AddWeight" component={AddWeight} />
      <Stack.Screen name="WorkoutTracker" component={WorkoutTracker} />
      <Stack.Screen name="WeightTracker" component={WeightTracker} />
      <Stack.Screen name="DayBreakdown" component={DayBreakdown} />
    </Stack.Navigator>
  )
}

export default ProgressTrackerNavigator;