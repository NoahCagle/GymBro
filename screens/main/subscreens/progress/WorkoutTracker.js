import { View, Text, ActivityIndicator, ScrollView } from 'react-native'
import React, { useCallback, useState } from 'react'
import { globalStyles, globalStyleVariables } from '../../../../styles/styles';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../../../firebase/FirebaseConfig';
import { useFocusEffect } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import DateReviewListItem from '../../../../components/workouts/DateReviewListItem';

function WorkoutTracker(props) {
    const navigation = props.navigation;
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

    // Organizes list of sets by their date
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
        return parsedData.dates.map((date, index) => {
            return (
                <DateReviewListItem key={index} dateData={date} navigation={navigation} />
            )
        })
    }

    return (
        <ScrollView>
            {returnBody()}
        </ScrollView>
    )
}

export default WorkoutTracker;