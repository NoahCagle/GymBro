import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { globalStyles, globalStyleVariables } from '../../styles/styles'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CreateAccount from './CreateAccount';
import auth from '../../firebase/FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Stack = createNativeStackNavigator();

function LoginPage({ navigation }) {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);

    const signIn = async () => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
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
                <TextInput style={globalStyles.inputText} placeholder="Email" placeholderTextColor={globalStyleVariables.outlineColor} autoCapitalize='none' textContentType='email' importantForAutofill='true' spellCheck={false} value={email} onChangeText={(text) => setEmail(filter(text))} />
                <TextInput style={globalStyles.inputText} placeholder="Password" placeholderTextColor={globalStyleVariables.outlineColor} autoCapitalize='none' textContentType='password' importantForAutofill='true' secureTextEntry={true} spellCheck={false} value={password} onChangeText={(text) => setPassword(filter(text))} />
                <View style={globalStyles.formButtonRowWrapper}>
                    <TouchableOpacity style={globalStyles.button} onPress={() => signIn()}>
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
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginPage} />
            <Stack.Screen name="Create Account" component={CreateAccount} />
        </Stack.Navigator>
    )
}