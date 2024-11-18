import { View, Text, ScrollView, ActivityIndicator } from 'react-native'
import React, { useCallback, useState } from 'react'
import { globalStyles, globalStyleVariables } from '../../../../styles/styles';
import { TouchableOpacity } from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { auth, db } from '../../../../firebase/FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

function DayBreakdown({ navigation }) {
    const route = useRoute();
    const date = route.params.date;
    const sets = date.sets.reverse();
    const [loading, setLoading] = useState(false);
    const [workoutsDoc, setWorkoutsDoc] = useState([]);
    const [parsedData, setParsedData] = useState([]);

    useFocusEffect(
        useCallback(() => {
            const loadWorkouts = async () => {
                setLoading(true);
                const workoutsDocRef = doc(db, "workouts", auth.currentUser.uid);
                try {
                    const snapshot = await getDoc(workoutsDocRef);
                    setWorkoutsDoc(snapshot.data().workouts);
                    setParsedData(separateWorkouts());
                } catch (error) {
                    alert("Can't load workout data: " + error.message);
                }
                setLoading(false);
            }
            loadWorkouts();
        }, [])
    )

    // seperates raw list of sets into lists separated by which workouts they belong to
    // ie all sets of workoutId = 0 are put into one list, while all sets of workoutId = 1 are put into another list
    const separateWorkouts = () => {
        let ret = [];
        for (let i = 0; i < sets.length; i++) {
            const foundIndex = includedInParsedData(sets[i].workoutId, ret);
            if (foundIndex == -1) {
                ret.push({ workoutId: sets[i].workoutId, sets: [sets[i]] });
            } else {
                ret[foundIndex].sets.push(sets[i]);
            }
        }
        return ret;
    }

    // used in separate workouts, checks to see if the workoutId of a set already has a list going or not
    const includedInParsedData = (workoutId, data) => {
        let ret = -1;
        for (let i = 0; i < data.length; i++) {
            if (data[i].workoutId == workoutId) {
                ret = i;
                break;
            }
        }
        return ret;
    }

    // returns the full data of a workout as found in the user's workout doc by the workoutId given
    const getWorkoutById = (id) => {
        let ret;
        for (let i = 0; i < workoutsDoc.length; i++) {
            if (workoutsDoc[i].id == id) {
                ret = workoutsDoc[i];
                break;
            }
        }
        return ret;
    }

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

    // used in returnBody to add a plus symbol in front of values that are positive
    const plusMinus = (input) => {
        if (input > 0) return '+' + input;
        return input;
    }

    const returnBody = () => {
        return (
            <View style={{ marginVertical: 5 }}>
                {
                    parsedData.map((wkout, index) => {
                        return (
                            <View style={globalStyles.formWrapper}>
                                <Text key={index} style={[globalStyles.formTitle, { textDecorationLine: 'underline' }]}>{getWorkoutById(wkout.workoutId).name}</Text>
                                <Text style={globalStyles.formSubtitle}>{wkout.sets.length} sets</Text>
                                {
                                    wkout.sets.map((set, index) => {
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
                                        <Text style={globalStyles.formText}>Avg Reps: {averageReps(wkout)} reps</Text>
                                        <Text style={globalStyles.formText}>Goal: {getWorkoutById(wkout.workoutId).reps} reps</Text>
                                    </View>
                                    <View style={globalStyles.rowSpacingWrapper}>
                                        <Text style={globalStyles.formText}>Avg Weight: {averageWeight(wkout)} lbs</Text>
                                        <Text style={globalStyles.formText}>Goal: {getWorkoutById(wkout.workoutId).weight} lbs</Text>
                                    </View>
                                    <Text style={[globalStyles.formSubtitle, { textDecorationLine: 'underline' }]}>Avg To Goal Difference</Text>
                                    <View style={globalStyles.rowSpacingWrapper}>
                                        <Text style={globalStyles.formText}>Reps: {plusMinus(averageReps(wkout) - getWorkoutById(wkout.workoutId).reps)} reps</Text>
                                        <Text style={globalStyles.formText}>Weight: {plusMinus(averageWeight(wkout) - getWorkoutById(wkout.workoutId).weight)} lbs</Text>
                                    </View>

                                    <View style={globalStyles.rowSpacingWrapper}>
                                        <TouchableOpacity style={globalStyles.button} onPress={() => navigation.navigate("EditWorkout", { name: getWorkoutById(wkout.workoutId).name, weight: getWorkoutById(wkout.workoutId).weight, sets: getWorkoutById(wkout.workoutId).sets, reps: getWorkoutById(wkout.workoutId).reps, id: getWorkoutById(wkout.workoutId).id, })}>
                                            <Text style={globalStyles.buttonTitle}>Edit Workout</Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                            </View>
                        )
                    })
                }
            </View>
        )
    }

    return (
        <View style={globalStyles.container}>
            <ScrollView>

                <View style={globalStyles.rowSpacingWrapper}>
                    <Text style={globalStyles.screenTitle}>{date.date}</Text>
                    <Text style={globalStyles.screenSubtitle}>Detailed Breakdown</Text>
                </View>
                {
                    loading ? (<ActivityIndicator size="large" color={globalStyleVariables.textColor} />)
                        :
                        returnBody()
                }

                <View style={globalStyles.rowSpacingWrapper}>
                    <TouchableOpacity style={globalStyles.button} onPress={() => navigation.goBack()}>
                        <Text style={globalStyles.buttonTitle}>Go back</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}

export default DayBreakdown;