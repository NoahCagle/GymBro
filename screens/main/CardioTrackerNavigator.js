import { Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { globalStyles } from '../../styles/styles'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CardioHistoryList from './subscreens/cardio/CardioHistoryList';
import LogCardioScreen from './subscreens/cardio/LogCardioScreen';
import AddCardioTypeScreen from './subscreens/cardio/AddCardioTypeScreen';

const Stack = createNativeStackNavigator();

function CardioTrackerNavigator() {
    const date = new Date().toLocaleDateString();

    return (
        <Stack.Navigator initialRouteName="Cardio History">
            <Stack.Screen name="Cardio History" component={CardioHistoryList} options={{ headerShown: false }} />
            <Stack.Screen name="LogCardio" component={LogCardioScreen} options={{ headerShown: false }} />
            <Stack.Screen name="AddCardioType" component={AddCardioTypeScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}

export default CardioTrackerNavigator