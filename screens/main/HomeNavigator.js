import { Image, Platform, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { globalStyles } from '../../styles/styles'
import { Button } from 'react-native'
import { auth } from '../../firebase/FirebaseConfig'
import { signOut } from 'firebase/auth'
import * as SecureStore from 'expo-secure-store';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import { useFocusEffect } from '@react-navigation/native'

function HomeNavigator({ navigation }) {

    const logOut = async () => {
        if (Platform.OS != 'web') {
            const savedEmail = await SecureStore.getItemAsync("gynBroEmail");
            const savedPassword = await SecureStore.getItemAsync("gymBroPassword");
            if (savedEmail) await SecureStore.deleteItemAsync("gymBroEmail");
            if (savedPassword) await SecureStore.deleteItemAsync("gymBroPassword");
        }
        await signOut(auth);
    }

    return (
        <View style={[globalStyles.container, { justifyContent: 'center' }]}>

        <Image style={{width: 256, height: 128, alignSelf: 'center'}} source={require('../../assets/logo.png')}/>

            <Text style={globalStyles.screenSubtitle}>What are we doing today?</Text>

            <View style={globalStyles.rowSpacingWrapper}>

                <TouchableOpacity style={globalStyles.button} onPress={() => navigation.navigate("Workouts")}>
                    <Text style={globalStyles.buttonTitle}>Start a Workout</Text>
                </TouchableOpacity>

                <TouchableOpacity style={globalStyles.button} onPress={() => navigation.navigate("Cardio")}>
                    <Text style={globalStyles.buttonTitle}>Log Cardio</Text>
                </TouchableOpacity>

            </View>

            <View style={globalStyles.rowSpacingWrapper}>

                <TouchableOpacity style={globalStyles.button} onPress={() => navigation.navigate("Progress Tracker")}>
                    <Text style={globalStyles.buttonTitle}>Manage Progress</Text>
                </TouchableOpacity>

                <TouchableOpacity style={globalStyles.button} onPress={() => navigation.navigate("Sleep Tracker")}>
                    <Text style={globalStyles.buttonTitle}>Log Sleep</Text>
                </TouchableOpacity>

            </View>

            <View style={{ marginVertical: 20 }}>
                <Button title="Sign Out" onPress={() => logOut()} />
            </View>
        </View>
    )
}

export default HomeNavigator