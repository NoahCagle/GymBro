import { View } from 'react-native'
import React from 'react'
import { globalStyles } from '../../styles/styles';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddWeight from './subscreens/progress/AddWeight';
import WeightTracker from './subscreens/progress/WeightTracker';

const Stack = createNativeStackNavigator();

function ProgressTracker({ navigation }) {
  return (
    <View style={globalStyles.container}>
      <WeightTracker navigation={navigation}/>
    </View>
  )
}

function ProgressTrackerNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProgressTracker" component={ProgressTracker}/>
      <Stack.Screen name="AddWeight" component={AddWeight}/>
    </Stack.Navigator>
  )
}

export default ProgressTrackerNavigator;