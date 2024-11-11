import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { globalStyles, globalStyleVariables } from '../../styles/styles'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/FirebaseConfig';

export default function CreateAccount({ navigation }) {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [loading, setLoading] = useState(false);

    const createAccount = async () => {
        setLoading(true);
        if (password != confirmPassword) alert("Password don't match!");
        else {
            try {
                await createUserWithEmailAndPassword(auth, email, password);
            } catch (error) {
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        alert(`Email address ${this.state.email} already in use.`);
                        break;
                    case 'auth/invalid-email':
                        alert(`Email address ${this.state.email} is invalid.`);
                        break;
                    case 'auth/operation-not-allowed':
                        alert(`Error during sign up.`);
                        break;
                    case 'auth/weak-password':
                        alert('Password is not strong enough. Add additional characters including special characters and numbers.');
                        break;
                    default:
                        alert(error.message);
                        break;
                }
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
    }

    const filter = (text) => {
        // Checks for spaces in the TextInput's input
        const sanitizedInput = text.replace(' ', '');
        return sanitizedInput;
    }

    return (
        <View style={[globalStyles.container, { alignItems: 'center', justifyContent: 'center' }]}>
            <Text style={globalStyles.screenTitle}>Create your account</Text>
            <View style={globalStyles.formWrapper}>
                <TextInput style={globalStyles.textInput} placeholder="Email" placeholderTextColor={globalStyleVariables.outlineColor} autoCapitalize='none' textContentType='email' importantForAutofill='true' spellCheck={false} value={email} onChangeText={(text) => setEmail(filter(text))} />
                <TextInput style={globalStyles.textInput} placeholder="Password" placeholderTextColor={globalStyleVariables.outlineColor} autoCapitalize='none' textContentType='password' importantForAutofill='true' secureTextEntry={true} spellCheck={false} value={password} onChangeText={(text) => setPassword(filter(text))} />
                <TextInput style={globalStyles.textInput} placeholder="Confirm Password" placeholderTextColor={globalStyleVariables.outlineColor} autoCapitalize='none' textContentType='password' importantForAutofill='true' secureTextEntry={true} spellCheck={false} value={confirmPassword} onChangeText={(text) => setConfirmPassword(filter(text))} />
                <View style={globalStyles.rowSpacingWrapper}>
                    <TouchableOpacity style={globalStyles.button} onPress={() => createAccount()}>
                        <Text style={globalStyles.buttonTitle}>Create Account</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={globalStyles.button} onPress={() => navigation.navigate("Login")}>
                        <Text style={globalStyles.buttonTitle}>Back to Sign In Page</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}