import { View } from 'react-native'
import React from 'react'
import { globalStyles } from '../../styles/styles'
import { Button } from 'react-native'
import {auth} from '../../firebase/FirebaseConfig'
import { signOut } from 'firebase/auth'

function HomeNavigator() {

    const logOut = async () => {
        await signOut(auth);
    }

    return (
        <View style={globalStyles.container}>
            <Button title="Sign Out" onPress={() => logOut()} />
        </View>
    )
}

export default HomeNavigator