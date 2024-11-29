import { View, Text, ScrollView } from 'react-native'
import React, { useCallback, useState } from 'react'
import { globalStyles, globalStyleVariables } from '../../../../styles/styles';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../../firebase/FirebaseConfig';
import { ActivityIndicator } from 'react-native';

function HistoricalReview({ navigation }) {
    const route = useRoute();
    const workoutId = route.params.workoutId;
    const workoutName = route.params.workoutName;
    const trackerDocRef = doc(db, "workoutTracker", auth.currentUser.uid);
    const [workoutsDoc, setWorkoutsDoc] = useState(null);
    const [parsedTracker, setParsedTracker] = useState(null);
    const [loading, setLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                setLoading(true);
                try {
                    const snapshot = await getDoc(trackerDocRef);
                    if (snapshot.exists()) {
                        let trackerData = snapshot.data();
                        setParsedTracker(parseData(trackerData.sets.reverse()));
                        setLoading(false);
                    }
                } catch (error) {
                    alert("Failed to load data: " + error.message);
                    setLoading(false);
                }
            }
            loadData();
        }, [])
    )

    const parseData = (data) => {
        let ret = { dates: [] };

        const dateIndex = (date) => {
            let index = -1;
            if (ret.dates != undefined) {
                for (let i = 0; i < ret.dates.length; i++) {
                    if (ret.dates[i].date == date) {
                        index = i;
                        break;
                    }
                }
            }
            return index;
        }

        for (let i = 0; i < data.length; i++) {
            let obj = data[i];
            if (obj.workoutId == workoutId) {
                let index = dateIndex(obj.date);
                if (index == -1) {
                    ret.dates.push({ date: obj.date, sets: [obj] });
                } else {
                    ret.dates[index].sets.push(obj);
                }
            }
        }

        return ret.dates;

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

    return (
        <View style={globalStyles.container}>
            <ScrollView>
                <Text style={globalStyles.screenTitle}>Historical Review</Text>
                <Text style={globalStyles.screenSubtitle}>Historical data for {workoutName}</Text>
                {
                    parsedTracker && !loading ?
                        parsedTracker.map((date, index) => {
                            return (
                                <View key={index} style={globalStyles.formWrapper}>
                                    <Text style={[globalStyles.formTitle, { textDecorationLine: 'underline' }]}>{date.date}</Text>
                                    <Text style={globalStyles.formSubtitle}>{date.sets.length} sets</Text>
                                    {
                                        date.sets.map((set, index) => {
                                            return (<Text key={index} style={globalStyles.formText}>{set.reps} reps at {set.weight} lbs</Text>)

                                        })
                                    }

                                    <Text style={[globalStyles.formSubtitle, { textDecorationLine: 'underline' }]}>Averages</Text>
                                    <Text style={globalStyles.formText}>Avg reps: {averageReps(date)} reps</Text>
                                    <Text style={globalStyles.formText}>Avg weight: {averageWeight(date)} lbs</Text>

                                </View>
                            )

                        })
                        : (<ActivityIndicator size='large' color={globalStyleVariables.textColor} />)
                }
            </ScrollView>
        </View>
    )
}

export default HistoricalReview;