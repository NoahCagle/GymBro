import { View, Text, ScrollView, ActivityIndicator, Platform } from 'react-native'
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
    const sets = date.sets;
    const [loading, setLoading] = useState(false);
    const [workoutsDoc, setWorkoutsDoc] = useState([]);
    const [sleepObj, setSleepObj] = useState({});
    const [cardioSessions, setCardioSessions] = useState({ sessions: [] });
    const [parsedData, setParsedData] = useState([]);
    const sleepTrackerDocRef = doc(db, "sleepTracker", auth.currentUser.uid);
    const cardioTrackerDocRef = doc(db, "cardioTracker", auth.currentUser.uid);

    useFocusEffect(
        useCallback(() => {
            const loadWorkouts = async () => {
                const workoutsDocRef = doc(db, "workouts", auth.currentUser.uid);
                try {
                    const snapshot = await getDoc(workoutsDocRef);
                    setWorkoutsDoc(snapshot.data().workouts);
                    setParsedData(separateWorkouts());
                } catch (error) {
                    alert("Can't load workout data: " + error.message);
                }
            }

            const loadSleepData = async () => {
                try {
                    const snapshot = await getDoc(sleepTrackerDocRef);
                    const data = snapshot.data();
                    setSleepObj(getSleepObj(data.logs));
                } catch (error) {
                    alert("Can't load sleep data: " + error.message);
                }
            }

            const loadCardioData = async () => {
                try {
                    const snapshot = await getDoc(cardioTrackerDocRef);
                    const data = snapshot.data();
                    setCardioSessions(getCardioSessions(data.sessions));
                } catch (error) {
                    alert("Can't load sleep data: " + error.message);
                }
            }

            setLoading(true);

            loadWorkouts();
            loadSleepData();
            loadCardioData();

            setLoading(false);

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

    // searches sleep tracker for data corresponding to this date
    const getSleepObj = (sleepData) => {
        let ret = null;
        sleepData.forEach((log, i) => {
            if (log.date == date.date) ret = log;
        });

        return ret;

    }

    const getCardioSessions = (cardioData) => {
        let ret = { sessions: [] };
        cardioData.forEach((session, i) => {
            if (session.date == date.date) ret.sessions.push(session);
        })
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

    const returnBody = () => {
        return (
            <View style={{ marginVertical: 5 }}>
                <Text style={globalStyles.screenSubtitle}>{sleepObj == null ? "No sleep data recorded for this date" : "Running on " + sleepObj.hours + " hours of sleep"}</Text>
                {
                    parsedData.map((wkout, index) => {
                        const workoutObj = getWorkoutById(wkout.workoutId);
                        return (
                            <SetsListItem key={index} workoutData={workoutObj} sessionData={wkout} header={workoutObj.name} navigation={navigation} />
                        )
                    })
                }{
                    cardioSessions.sessions.length == 0 ? (<Text style={globalStyles.screenSubtitle}>No cardio recorded for this date</Text>) :
                        cardioSessions.sessions.map((session, index) => {
                            return (
                                <CardioListItem key={index} session={session} headerPrefix={"Cardio: "} />
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