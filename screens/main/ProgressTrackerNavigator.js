import { Text, View } from 'react-native'
import React from 'react'
import { globalStyles } from '../../styles/styles';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddWeight from './subscreens/progress/AddWeight';
import WeightTracker from './subscreens/progress/WeightTracker';
import WorkoutTracker from './subscreens/progress/WorkoutTracker';
import { TouchableOpacity } from 'react-native';

const Stack = createNativeStackNavigator();

function ProgressTracker({ navigation }) {
  return (
    <View style={globalStyles.container}>
      <WorkoutTracker navigation={navigation} embedded={true}/>
      <WeightTracker navigation={navigation}/>
      
      <View style={globalStyles.rowSpacingWrapper}>
                <TouchableOpacity style={globalStyles.button}>
                    <Text style={globalStyles.buttonTitle}>View Calendar</Text>
                </TouchableOpacity>
            </View>
    </View>
  )
}

function ProgressTrackerNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProgressTracker" component={ProgressTracker}/>
      <Stack.Screen name="AddWeight" component={AddWeight}/>
      <Stack.Screen name="WorkoutTracker" component={WorkoutTracker}/>
    </Stack.Navigator>
  )
}

export default ProgressTrackerNavigator;