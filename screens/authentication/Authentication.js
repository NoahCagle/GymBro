import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { globalStyles, globalStyleVariables } from '../../styles/styles'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CreateAccount from './CreateAccount';
import auth from '../../firebase/FirebaseConfig';

const Stack = createNativeStackNavigator();

function LoginPage({ navigation }) {
    const AUTH = auth;

    return (
        <View style={[globalStyles.container, { alignItems: 'center', justifyContent: 'center' }]}>
            <Text style={globalStyles.screenTitle}>Sign in</Text>
            <View style={globalStyles.formWrapper}>
                <TextInput style={globalStyles.inputText} placeholder="Email" placeholderTextColor={globalStyleVariables.outlineColor} />
                <TextInput style={globalStyles.inputText} placeholder="Password" placeholderTextColor={globalStyleVariables.outlineColor} />
                <View style={globalStyles.formButtonRowWrapper}>
                    <TouchableOpacity style={globalStyles.button} onPress={() => navigation.navigate("Authenticated")}>
                        <Text style={globalStyles.buttonTitle}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={globalStyles.button} onPress={() => navigation.navigate("Create Account")}>
                        <Text style={globalStyles.buttonTitle}>Create Account</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default function Authentication() {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Login" component={LoginPage}/>
            <Stack.Screen name="Create Account" component={CreateAccount}/>
        </Stack.Navigator>
    )
}