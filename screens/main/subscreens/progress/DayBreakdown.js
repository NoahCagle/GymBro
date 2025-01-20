import { View, Text, ScrollView, ActivityIndicator } from 'react-native'
import React, { useCallback, useState } from 'react'
import { globalStyles, globalStyleVariables } from '../../../../styles/styles';
import { TouchableOpacity } from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { auth, db } from '../../../../firebase/FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import SetsListItem from '../../../../components/workouts/SetsListItem';
import CardioListItem from '../../../../components/workouts/CardioListItem';

function DayBreakdown({ navigation }) {
    const route = useRoute();
    const date = route.params.date;
    const organizedSets = route.params.organizedSets;
    const [loading, setLoading] = useState(false);
    const [workoutsDoc, setWorkoutsDoc] = useState(null);
    const workoutsDocRef = doc(db, "workouts", auth.currentUser.uid);

    useFocusEffect(
        useCallback(() => {
            const loadWorkoutsDoc = async () => {
                setLoading(true);
                try {
                    const snapshot = await getDoc(workoutsDocRef);
                    setWorkoutsDoc(snapshot.data().workouts);
                } catch (error) {
                    alert("Can't load workout data: " + error.message);
                }
                setLoading(false);
            }

            loadWorkoutsDoc();

        }, [])
    )

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

    const returnBody = () => {
        return (
            <View style={{ marginVertical: 5 }}>
                <Text style={globalStyles.screenSubtitle}>{date.sleepLog == null ? "No sleep data recorded for this date" : "Running on " + date.sleepLog.hours + " hours of sleep"}</Text>
                <Text style={globalStyles.screenSubtitle}>{date.bodyWeightLogs.length == 0 ? "No weigh-in recorded for this date" : "Weighed in at " + date.bodyWeightLogs[0].weight + " lbs"}</Text>
                {
                    organizedSets.map((wkout, index) => {
                        const workoutObj = getWorkoutById(wkout.workoutId);
                        return (
                            <SetsListItem key={index} workoutData={workoutObj} sessionData={wkout} header={workoutObj.name}/>
                        )
                    })
                }
                {
                    date.cardioLogs.map((cardioSession, index) => {
                        return (
                            <CardioListItem key={index} session={cardioSession} headerPrefix={"Cardio: "} />
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
                    loading || workoutsDoc == null ? (<ActivityIndicator size="large" color={globalStyleVariables.textColor} />)
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