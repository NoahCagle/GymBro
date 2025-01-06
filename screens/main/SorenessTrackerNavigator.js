import { Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { globalStyles } from '../../styles/styles'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SorenessHistoryScreen from './subscreens/soreness/SorenessHistoryScreen';
import LogSorenessScreen from './subscreens/soreness/LogSorenessScreen';

const Stack = createNativeStackNavigator();

function SorenessTrackerNavigator() {
    const date = new Date().toLocaleDateString();

    return (
        <Stack.Navigator initialRouteName="SorenessHistory">
            <Stack.Screen name="SorenessHistory" component={SorenessHistoryScreen} options={{headerShown: false}}/>
            <Stack.Screen name="LogSoreness" component={LogSorenessScreen} options={{headerShown: false}}/>
        </Stack.Navigator>
    )
}

export default SorenessTrackerNavigator