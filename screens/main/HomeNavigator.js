import { Platform, View } from 'react-native'
import React from 'react'
import { globalStyles } from '../../styles/styles'
import { Button } from 'react-native'
import { auth } from '../../firebase/FirebaseConfig'
import { signOut } from 'firebase/auth'
import * as SecureStore from 'expo-secure-store';

function HomeNavigator() {

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
        <View style={globalStyles.container}>
            <Button title="Sign Out" onPress={() => logOut()} />
        </View>
    )
}

export default HomeNavigator