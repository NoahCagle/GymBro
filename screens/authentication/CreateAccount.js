import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { globalStyles, globalStyleVariables } from '../../styles/styles'

export default function CreateAccount({ navigation }) {
  return (
    <View style={[globalStyles.container, { alignItems: 'center', justifyContent: 'center' }]}>
            <Text style={globalStyles.screenTitle}>Create your account</Text>
            <View style={globalStyles.formWrapper}>
                <TextInput style={globalStyles.inputText} placeholder="Email" placeholderTextColor={globalStyleVariables.outlineColor} />
                <TextInput style={globalStyles.inputText} placeholder="Password" placeholderTextColor={globalStyleVariables.outlineColor} />
                <TextInput style={globalStyles.inputText} placeholder="Confirm Password" placeholderTextColor={globalStyleVariables.outlineColor} />
                <View style={globalStyles.formButtonRowWrapper}>
                    <TouchableOpacity style={globalStyles.button}>
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