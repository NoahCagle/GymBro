import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AddWorkoutScreen from './subscreens/workouts/AddWorkoutScreen'
import WorkoutGuide from './subscreens/workouts/WorkoutGuide'
import EditWorkoutScreen from './subscreens/workouts/EditWorkoutScreen'
import WorkoutsListScreen from './subscreens/workouts/WorkoutsListScreen'
import AddGroupScreen from './subscreens/workouts/AddGroupScreen'

const Stack = createNativeStackNavigator();

function WorkoutsNavigator() {
  return (
    <Stack.Navigator initialRouteName="WorkoutsList">
      <Stack.Screen name="WorkoutsList" component={WorkoutsListScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AddWorkout" component={AddWorkoutScreen} options={{ headerShown: false }} />
      <Stack.Screen name="EditWorkout" component={EditWorkoutScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AddGroup" component={AddGroupScreen} options={{ headerShown: false }} />
      <Stack.Screen name="WorkoutGuide" component={WorkoutGuide} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

export default WorkoutsNavigator