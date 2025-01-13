import { Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { globalStyles } from '../../styles/styles';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddWeight from './subscreens/progress/AddWeight';
import WeightTracker from './subscreens/progress/WeightTracker';
import WorkoutTracker from './subscreens/progress/WorkoutTracker';
import DayBreakdown from './subscreens/progress/DayBreakdown';

const Stack = createNativeStackNavigator();

function ProgressTracker({ navigation }) {
  const [currentScreen, setCurrentScreen] = useState(0);

  const returnCurrentScreen = (screenId) => {
    switch (screenId) {
      case 0:
        return (<WorkoutTracker navigation={navigation} />)
      case 1:
        return (<WeightTracker navigation={navigation} />);
    }
  }

  const topTabBar = () => {
    return (
      <View style={globalStyles.rowSpacingWrapper}>
        <TouchableOpacity onPress={() => setCurrentScreen(0)}>
          <Text style={currentScreen == 0 ? globalStyles.screenTabSelected : globalStyles.screenTab}>Training Review</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentScreen(1)}>
          <Text style={currentScreen == 1 ? globalStyles.screenTabSelected : globalStyles.screenTab}>Body Weight</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={globalStyles.container}>
      {
        topTabBar()
      }
      {
        returnCurrentScreen(currentScreen)
      }
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