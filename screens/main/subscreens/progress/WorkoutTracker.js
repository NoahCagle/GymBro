import { View, Text, ActivityIndicator, ScrollView } from 'react-native'
import React, { useCallback, useState } from 'react'
import { globalStyles, globalStyleVariables } from '../../../../styles/styles';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../../../firebase/FirebaseConfig';
import { useFocusEffect } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';

function WorkoutTracker(props) {
    const navigation = props.navigation;
    const embedded = props.embedded;
    const docRef = doc(db, "workoutTracker", auth.currentUser.uid);
    const [loading, setLoading] = useState(false);
    const [parsedData, setParsedData] = useState([]);
    const [docExists, setDocExists] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                setLoading(true);
                try {
                    const snapshot = await getDoc(docRef);
                    if (snapshot.exists()) {
                        setDocExists(true);

                        const data = snapshot.data();

                        setParsedData(parseData(data.sets));

                    } else
                        setDocExists(false);
                } catch (error) {
                    alert("Failed to load workouts: " + error.message)
                }
                setLoading(false);
            }

            loadData();

        }, [])
    )

    // Separates raw data from the database into arrays based on each date found
    const parseData = (sets) => {
        let parse = { dates: [] };
        const dateExists = (date) => {
            for (let i = 0; i < parse.dates.length; i++) {
                let obj = parse.dates[i];
                if (obj.date == date) return i;
            }
            return -1;
        }

        for (let i = 0; i < sets.length; i++) {
            let dateFound = dateExists(sets[i].date);
            if (dateFound == -1) {
                parse.dates.push({ date: sets[i].date, sets: [sets[i]] });
            } else {
                parse.dates[dateFound].sets.push(sets[i]);
            }
        }

        // Reversed dates here so that the first workout session in the array is the latest session
        parse.dates.reverse();

        return parse;

    }

    const returnBody = () => {
        if (loading || parsedData == [])
            return (<ActivityIndicator size='large' color={globalStyleVariables.textColor} />);
        if (!docExists)
            return (<Text style={globalStyles.formText}>No workouts recorded yet!</Text>);
        let ret = parsedData.dates.map((date, i) => {
            return (
                <View key={i} style={{ marginVertical: 5 }}>
                    <Text key={i} style={[globalStyles.formTitle, { textDecorationLine: "underline" }]}>{date.date}</Text>
                    <View style={globalStyles.rowSpacingWrapper}>
                        <TouchableOpacity style={globalStyles.button} onPress={() => navigation.navigate("DayBreakdown", { date: parsedData.dates[i] })}>
                            <Text style={globalStyles.buttonTitle}>Detailed Breakdown -{'>'}</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        parsedData.dates[i].sets.map((set, j) => {
                            return (<Text key={j} style={globalStyles.formText}>{set.name}: {set.reps} reps at {set.weight} lbs</Text>)
                        })
                    }
                </View>
            )
        })
        return ret;
    }

    // If this component is embedded, include a button to navigate to the WorkoutTracker page. Otherwise, show only the screen title
    const returnHeader = () => {
        if (embedded)
            return (
                <Text style={globalStyles.formTitle}>Workout Tracker</Text>
            )
        return (<Text style={globalStyles.formTitle}>Workout Tracker</Text>);
    }

    // If embedded into ProgressTracker, return content only within a form limited to a height of 45%
    if (embedded)
        return (
            <View style={[globalStyles.formWrapper, { maxHeight: '45%' }]}>
                {returnHeader()}
                <ScrollView>
                    {returnBody()}
                </ScrollView>
                <View style={globalStyles.rowSpacingWrapper}>
                    <TouchableOpacity style={globalStyles.button} onPress={() => navigation.navigate("WorkoutTracker")}>
                        <Text style={globalStyles.buttonTitle}>Expand</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    // If not embedded, return a full page with a 'Back' button
    return (
        <View style={globalStyles.container}>
            <ScrollView>
                <View style={globalStyles.formWrapper}>
                    {returnHeader()}
                    {returnBody()}
                </View>
                <View style={globalStyles.rowSpacingWrapper}>
                    <TouchableOpacity style={globalStyles.button} onPress={() => navigation.goBack()}>
                        <Text style={globalStyles.buttonTitle}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}

export default WorkoutTracker;