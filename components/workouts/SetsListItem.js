import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { globalStyles } from '../../styles/styles';

function SetsListItem(props) {
    const workoutData = props.workoutData;
    const sessionData = props.sessionData;
    const header = props.header;
    const navigation = props.navigation;

    // computes average reps from a list of sets
    const averageReps = (wkout) => {
        let ret = 0;
        for (let i = 0; i < wkout.sets.length; i++) {
            ret += wkout.sets[i].reps;
        }
        ret = ret / wkout.sets.length;
        return Math.round(ret);
    }

    // computes average weight from a list of sets
    const averageWeight = (wkout) => {
        let ret = 0;
        for (let i = 0; i < wkout.sets.length; i++) {
            ret += wkout.sets[i].weight;
        }
        ret = ret / wkout.sets.length;
        return Math.round(ret);
    }

    // adds a plus symbol in front of values that are positive
    const plusMinus = (input) => {
        if (input > 0) return '+' + input;
        return input;
    }

    return (
        <View style={globalStyles.formWrapper}>
            <Text style={[globalStyles.formTitle, { textDecorationLine: 'underline' }]}>{header}</Text>
            <Text style={globalStyles.formSubtitle}>{sessionData.sets.length} sets</Text>
            {
                sessionData.sets.map((set, index) => {
                    return (
                        <View key={index}>
                            <Text style={globalStyles.formText}>{set.reps} reps at {set.weight} lbs</Text>
                        </View>
                    )
                })
            }
            <View>
                <Text style={[globalStyles.formSubtitle, { textDecorationLine: 'underline' }]}>Mathematical Analysis</Text>
                <View style={globalStyles.rowSpacingWrapper}>
                    <Text style={globalStyles.formText}>Avg Reps: {averageReps(sessionData)} reps</Text>
                    <Text style={globalStyles.formText}>Avg Weight: {averageWeight(sessionData)} lbs</Text>
                </View>
                <View style={globalStyles.rowSpacingWrapper}>
                    <Text style={globalStyles.formText}>Rep Goal: {workoutData.reps} reps</Text>
                    <Text style={globalStyles.formText}>Weight Goal: {workoutData.weight} lbs</Text>
                </View>
                <View style={globalStyles.rowSpacingWrapper}>
                    <Text style={globalStyles.formText}>Difference: {plusMinus(averageReps(sessionData) - workoutData.reps)} reps</Text>
                    <Text style={globalStyles.formText}>Difference: {plusMinus(averageWeight(sessionData) - workoutData.weight)} lbs</Text>
                </View>

                <View style={globalStyles.rowSpacingWrapper}>
                    <TouchableOpacity style={globalStyles.button} onPress={() => navigation.navigate("EditWorkout", { name: workoutData.name, weight: workoutData.weight, sets: workoutData.sets, reps: workoutData.reps, id: workoutData.id, })}>
                        <Text style={globalStyles.buttonTitle}>Edit Workout</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    )
}

export default SetsListItem;