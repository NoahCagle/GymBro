import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, View, Text } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from './screens/main/Home';
import WorkoutsScreen from './screens/main/WorkoutsScreen';
import ProgressTrackerScreen from './screens/main/ProgressTrackerScreen';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName='Home'>
          <Drawer.Screen name="Home" component={Home}/>
          <Drawer.Screen name="Workouts" component={WorkoutsScreen}/>
          <Drawer.Screen name="Progress Tracker" component={ProgressTrackerScreen}/>
        </Drawer.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
