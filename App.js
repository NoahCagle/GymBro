import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Button, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import HomeNavigator from './screens/main/HomeNavigator';
import WorkoutsNavigator from './screens/main/WorkoutsNavigator';
import ProgressTrackerNavigator from './screens/main/ProgressTrackerNavigator';
import ImageLogo, { globalStyles } from './styles/styles';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Authentication from './screens/authentication/Authentication';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase/FirebaseConfig';
import SorenessTrackerNavigator from './screens/main/SorenessTrackerNavigator';
import CardioTrackerNavigator from './screens/main/CardioTrackerNavigator';
import SleepTrackerNavigator from './screens/main/SleepTrackerNavigator';
import * as SecureStore from 'expo-secure-store';
import { blankWorkoutsDoc } from './data/DataStructures';
import DataTransfer from './screens/main/DataTransfer';

const Drawer = createDrawerNavigator();
const CoreStack = createNativeStackNavigator();

function CustomDrawer(props) {

  const logOut = async () => {
    if (Platform.OS != 'web') {
      const savedEmail = await SecureStore.getItemAsync("gymBroEmail");
      const savedPassword = await SecureStore.getItemAsync("gymBroPassword");
      if (savedEmail) await SecureStore.deleteItemAsync("gymBroEmail");
      if (savedPassword) await SecureStore.deleteItemAsync("gymBroPassword");
    }
    await signOut(auth);
  }

  return (
    <DrawerContentScrollView {...props}>
      <ImageLogo width={200} height={100} />
      <Text style={globalStyles.formSubtitle}>{auth.currentUser.email}</Text>
      <View style={globalStyles.rowSpacingWrapper}>
        <TouchableOpacity style={globalStyles.button} onPress={() => logOut()}>
          <Text style={globalStyles.buttonTitle}>Sign Out</Text>
        </TouchableOpacity>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  )
}

function Authenticated() {
  return (
    <View style={styles.container}>
      <Drawer.Navigator drawerContent={(props) => <CustomDrawer {...props} />} screenOptions={globalStyles.drawerStyles.mainDrawerStyle}>
        <Drawer.Screen name="Home" component={HomeNavigator} options={globalStyles.drawerStyles.mainScreenOptions} />
        <Drawer.Screen name="Workouts" component={WorkoutsNavigator} options={globalStyles.drawerStyles.mainScreenOptions} />
        <Drawer.Screen name="Cardio" component={CardioTrackerNavigator} options={globalStyles.drawerStyles.mainScreenOptions} />
        <Drawer.Screen name="Progress Tracker" component={ProgressTrackerNavigator} options={globalStyles.drawerStyles.mainScreenOptions} />
        {/* <Drawer.Screen name="Soreness Tracker" component={SorenessTrackerNavigator} options={globalStyles.drawerStyles.mainScreenOptions} /> */}
        <Drawer.Screen name="Sleep Tracker" component={SleepTrackerNavigator} options={globalStyles.drawerStyles.mainScreenOptions} />
        {/* <Drawer.Screen name="Data Transfer" component={DataTransfer} options={globalStyles.drawerStyles.mainScreenOptions} /> */}
      </Drawer.Navigator>
    </View>
  )
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
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
