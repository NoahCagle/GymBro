import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeNavigator from './screens/main/HomeNavigator';
import WorkoutsNavigator from './screens/main/WorkoutsNavigator';
import ProgressTrackerNavigator from './screens/main/ProgressTrackerNavigator';
import { globalStyles } from './styles/styles';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Authentication from './screens/authentication/Authentication';
import { onAuthStateChanged } from 'firebase/auth';
import auth from './firebase/FirebaseConfig';

const Drawer = createDrawerNavigator();
const CoreStack = createNativeStackNavigator();

function Authenticated() {
  return (
    <View style={styles.container}>
      <Drawer.Navigator initialRouteName="Home" screenOptions={globalStyles.drawerStyles.mainDrawerStyle}>
        <Drawer.Screen name="Home" component={HomeNavigator} options={globalStyles.drawerStyles.mainScreenOptions}
        />
        <Drawer.Screen name="Workouts" component={WorkoutsNavigator} options={globalStyles.drawerStyles.mainScreenOptions} />
        <Drawer.Screen name="Progress Tracker" component={ProgressTrackerNavigator} options={globalStyles.drawerStyles.mainScreenOptions} />
      </Drawer.Navigator>
    </View>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user != null) console.log(user.uid);
    })
  }, [user])

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <CoreStack.Navigator screenOptions={{ headerShown: false }}>
          {
            user ?
              (
                <CoreStack.Screen name="Authenticated" component={Authenticated} />
              ) : (
                <CoreStack.Screen name="Authentication" component={Authentication} />
              )
          }
        </CoreStack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
