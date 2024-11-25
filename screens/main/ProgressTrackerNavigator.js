import { Text, View } from 'react-native'
import React from 'react'
import { globalStyles } from '../../styles/styles';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddWeight from './subscreens/progress/AddWeight';
import WeightTracker from './subscreens/progress/WeightTracker';
import WorkoutTracker from './subscreens/progress/WorkoutTracker';
import CalendarView from './subscreens/progress/calendar/CalendarView';
import DayBreakdown from './subscreens/progress/DayBreakdown';
import { TouchableOpacity } from 'react-native';

const Stack = createNativeStackNavigator();

function ProgressTracker({ navigation }) {
  return (
    <View style={globalStyles.container}>
      <WorkoutTracker navigation={navigation} embedded={true} />
      <WeightTracker navigation={navigation} />

      <View style={globalStyles.rowSpacingWrapper}>
        <TouchableOpacity style={globalStyles.button} onPress={() => navigation.navigate("CalendarView")}>
          <Text style={globalStyles.buttonTitle}>View Calendar</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

function ProgressTrackerNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProgressTracker" component={ProgressTracker} />
      <Stack.Screen name="AddWeight" component={AddWeight} />
      <Stack.Screen name="WorkoutTracker" component={WorkoutTracker} />
      <Stack.Screen name="CalendarView" component={CalendarView} />
      <Stack.Screen name="DayBreakdown" component={DayBreakdown} />
    </Stack.Navigator>
  )
}

export default ProgressTrackerNavigator;