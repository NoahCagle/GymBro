import { Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { globalStyles } from '../../../../styles/styles'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SleepHistoryScreen from './sleepTracker/SleepHistoryScreen';
import LogSleepScreen from './sleepTracker/LogSleepScreen';

const Stack = createNativeStackNavigator();

function SleepTrackerNavigator() {
    const date = new Date().toLocaleDateString();

    return (
        <Stack.Navigator initialRouteName="SleepHistory">
            <Stack.Screen name="SleepHistory" component={SleepHistoryScreen} options={{headerShown: false}} />
            <Stack.Screen name="LogSleep" component={LogSleepScreen} options={{headerShown: false}} />
        </Stack.Navigator>
    )
}

export default SleepTrackerNavigator