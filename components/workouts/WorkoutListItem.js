import { View, Text } from 'react-native'
import React from 'react'
import { globalStyles } from '../../styles/styles';
import { TouchableOpacity } from 'react-native';

function WorkoutListItem(props) {
    const navigation = props.navigation;
    const name = props.name;
    const sets = props.sets;
    const reps = props.reps;
    const weight = props.weight;

    return (
        <View>
            <View style={globalStyles.formWrapper}>
                <Text style={globalStyles.formTitle}>{name}</Text>
                <Text style={globalStyles.formText}>{sets} sets of {reps} at {weight} lbs</Text>
                <View style={globalStyles.formButtonRowWrapper}>
                    <TouchableOpacity style={globalStyles.button}>
                        <Text style={globalStyles.buttonTitle}>Play</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={globalStyles.button}>
                        <Text style={globalStyles.buttonTitle}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={globalStyles.button}>
                        <Text style={globalStyles.buttonTitle}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default WorkoutListItem;