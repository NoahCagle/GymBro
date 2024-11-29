import { View, Text, Alert } from 'react-native'
import React, { useState } from 'react'
import { globalStyles } from '../../styles/styles';
import { TouchableOpacity } from 'react-native';

function WorkoutListItem(props) {
    const navigation = props.navigation;
    const name = props.name;
    const sets = props.sets;
    const reps = props.reps;
    const weight = props.weight;
    const group = props.group;
    const id = props.id;
    const deleteAction = props.deleteAction;
    const [visible, setVisible] = useState(true);

    const confirmDeletion = () => {
        Alert.alert('Confirm deletion', 'Are you sure you want to delete ' + name + '?', [
            {
                text: 'Delete',
                onPress: () => {
                    deleteAction();
                    setVisible(false);
                    console.log("deleted " + name);
                },
            },
            {
                text: 'Cancel',
                onPress: () => console.log("don't delete"),
                style: 'cancel',
            },
        ]);
    }

    if (visible)
        return (
            <View>
                <View style={globalStyles.formWrapper}>
                    <Text style={globalStyles.formTitle}>{name}</Text>
                    <Text style={globalStyles.formText}>{sets} sets of {reps} at {weight} lbs</Text>
                    <View style={globalStyles.rowSpacingWrapper}>
                        <TouchableOpacity style={globalStyles.button} onPress={() => navigation.navigate("WorkoutGuide", { name: name, weight: weight, sets: sets, reps: reps, group: group, id: id })}>
                            <Text style={globalStyles.buttonTitle}>Start</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={globalStyles.button} onPress={() => navigation.navigate("EditWorkout", { name: name, weight: weight, sets: sets, reps: reps, group: group, id: id })}>
                            <Text style={globalStyles.buttonTitle}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={globalStyles.button} onPress={() => confirmDeletion()}>
                            <Text style={globalStyles.buttonTitle}>Delete</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={globalStyles.button} onPress={() => navigation.navigate("HistoricalReview", {workoutId: id, workoutName: name})}>
                            <Text style={globalStyles.buttonTitle}>History</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
}

export default WorkoutListItem;