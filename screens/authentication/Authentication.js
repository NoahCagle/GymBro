import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Platform } from 'react-native'
import React, { useCallback, useState } from 'react'
import { globalStyles, globalStyleVariables } from '../../styles/styles'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CreateAccount from './CreateAccount';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/FirebaseConfig';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

function LoginPage({ navigation }) {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            const tryRestore = async () => {
                const savedEmail = await SecureStore.getItemAsync("gymBroEmail");
                const savedPassword = await SecureStore.getItemAsync("gymBroPassword");
                if (savedEmail && savedPassword) {
                    signInWithEmailAndPassword(auth, savedEmail, savedPassword);
                } else setLoading(false);
            }
            if (Platform.OS != 'web')
                tryRestore();
            else setLoading(false);
        }, [])
    )

    const signIn = async () => {
        setLoading(true);
        try {
            const u = await signInWithEmailAndPassword(auth, email, password);
            if (Platform.OS != 'web') {
                // I don't like the idea of saving credentials locally, but this is my most secure option unless I want to launch a custom backend, which I don't
                await SecureStore.setItemAsync("gymBroEmail", email);
                await SecureStore.setItemAsync("gymBroPassword", password);
            }
        } catch (error) {
            if (error.code == 'auth/invalid-credential')
                alert("Failed to sign in. Have you created an account yet?");
            else
                alert("Failed to sign in: " + error.message)
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const filter = (text) => {
        // Checks for spaces in the TextInput's input
        const sanitizedInput = text.replace(' ', '');
        return sanitizedInput;
    }

    return (
        <View style={[globalStyles.container, { alignItems: 'center', justifyContent: 'center' }]}>
            <Text style={globalStyles.screenTitle}>Sign in</Text>
            <View style={globalStyles.formWrapper}>
                <TextInput style={globalStyles.textInput} placeholder="Email" placeholderTextColor={globalStyleVariables.outlineColor} autoCapitalize='none' textContentType='email' importantForAutofill='true' spellCheck={false} value={email} onChangeText={(text) => setEmail(filter(text))} onSubmitEditing={() => signIn()}/>
                <TextInput style={globalStyles.textInput} placeholder="Password" placeholderTextColor={globalStyleVariables.outlineColor} autoCapitalize='none' textContentType='password' importantForAutofill='true' secureTextEntry={true} spellCheck={false} value={password} onChangeText={(text) => setPassword(filter(text))} onSubmitEditing={() => signIn()}/>
                {

                    loading ? (<ActivityIndicator size='large' color={globalStyleVariables.textColor} />) : (
                        <View style={globalStyles.rowSpacingWrapper}>
                            <TouchableOpacity style={globalStyles.button} onPress={() => signIn()}>
                                <Text style={globalStyles.buttonTitle}>Login</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={globalStyles.button} onPress={() => navigation.navigate("Create Account")}>
                                <Text style={globalStyles.buttonTitle}>Create Account</Text>
                            </TouchableOpacity>
                        </View>
                    )}
            </View>
        </View>
    )
}

export default function Authentication() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginPage} />
            <Stack.Screen name="Create Account" component={CreateAccount} />
        </Stack.Navigator>
    )
}