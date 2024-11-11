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
    const id = props.id;
    const deleteAction = props.deleteAction;

    return (
        <View>
            <View style={globalStyles.formWrapper}>
                <Text style={globalStyles.formTitle}>{name}</Text>
                <Text style={globalStyles.formText}>{sets} sets of {reps} at {weight} lbs</Text>
                <View style={globalStyles.rowSpacingWrapper}>
                    <TouchableOpacity style={globalStyles.button} onPress={() => navigation.navigate("WorkoutGuide", { name: name, weight: weight, sets: sets, reps: reps, id: id })}>
                        <Text style={globalStyles.buttonTitle}>Start</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={globalStyles.button} onPress={() => navigation.navigate("EditWorkout", { name: name, weight: weight, sets: sets, reps: reps, id: id })}>
                        <Text style={globalStyles.buttonTitle}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={globalStyles.button} onPress={deleteAction}>
                        <Text style={globalStyles.buttonTitle}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default WorkoutListItem;