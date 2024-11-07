import { View, Text, TextInput, KeyboardAvoidingView } from 'react-native'
import React from 'react'
import { globalStyles, globalStyleVariables } from '../../../../styles/styles';
import { TouchableOpacity } from 'react-native';

function AddWorkoutScreen({ navigation }) {
    return (
        <View style={globalStyles.container}>
            <KeyboardAvoidingView>
                <Text style={globalStyles.screenTitle}>Add Workout</Text>
                <View style={globalStyles.formWrapper}>
                    <TextInput style={globalStyles.inputText} placeholder="Workout Name" placeholderTextColor={globalStyleVariables.outlineColor} />
                    <TextInput style={globalStyles.inputText} placeholder="Weight" placeholderTextColor={globalStyleVariables.outlineColor} />
                    <TextInput style={globalStyles.inputText} placeholder="Sets" placeholderTextColor={globalStyleVariables.outlineColor} />
                    <View style={globalStyles.formButtonRowWrapper}>
                        <TouchableOpacity style={globalStyles.button}>
                            <Text style={globalStyles.buttonTitle}>Add Workout</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={globalStyles.button} onPress={() => navigation.goBack()}>
                            <Text style={globalStyles.buttonTitle}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}

export default AddWorkoutScreen;