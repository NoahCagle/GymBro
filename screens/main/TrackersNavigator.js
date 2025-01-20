import React from 'react'
import TrainingTrackerNavigator from './subscreens/tracking/TrainingTrackerNavigator';
import WeightTrackerNavigator from './subscreens/tracking/WeightTrackerNavigator';
import SleepTrackerNavigator from './subscreens/tracking/SleepTrackerNavigator';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { globalStyleVariables } from '../../styles/styles';
import { FontAwesome5 } from '@expo/vector-icons';

const Stack = createBottomTabNavigator();

function TrackersNavigator() {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: 'coral',
      tabBarInactiveTintColor: 'white',
      tabBarStyle: {
        backgroundColor: globalStyleVariables.formBgColor
      }
    }}>
      <Stack.Screen name="Training" component={TrainingTrackerNavigator} options={{
        tabBarIcon: ({ color, size }) => (
          <FontAwesome5 name="dumbbell" color={color} size={size} />
        )
      }} />
      <Stack.Screen name="Body Weight" component={WeightTrackerNavigator} options={{
        tabBarIcon: ({ color, size }) => (
          <FontAwesome5 name="tachometer-alt" color={color} size={size} />
        )
      }} />
      <Stack.Screen name="Sleep" component={SleepTrackerNavigator} options={{
        tabBarIcon: ({ color, size }) => (
          <FontAwesome5 name="bed" color={color} size={size} />
        )
      }} />
    </Stack.Navigator>
  )
}

export default TrackersNavigator;