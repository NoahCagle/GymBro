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
    const workoutDocRef = doc(db, "workoutTracker", auth.currentUser.uid);
    const cardioDocRef = doc(db, "cardioTracker", auth.currentUser.uid);
    const [loading, setLoading] = useState(false);
    const [parsedData, setParsedData] = useState([]);
    const [docExists, setDocExists] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const loadWeightTrainingData = async () => {
                setLoading(true);
                try {
                    const snapshot = await getDoc(workoutDocRef);
                    if (snapshot.exists()) {
                        setDocExists(true);

                        const data = snapshot.data();

                        setParsedData(parseData(data.sets));

                    } else
                        setDocExists(false);
                } catch (error) {
                    alert("Failed to load workouts: " + error.message)
                }
            }

            const loadCardioData = async () => {
                try {
                    const snapshot = await getDoc(cardioDocRef);
                    if (snapshot.exists()) {
                        const data = snapshot.data();

                        addCardioData(data.sessions);

                    }
                } catch (error) {
                    alert("Failed to load workouts: " + error.message)
                }
                setLoading(false);
            }

            loadWeightTrainingData();
            loadCardioData();

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
                parse.dates.push({ date: sets[i].date, sets: [sets[i]], cardioSessions: []});
            } else {
                parse.dates[dateFound].sets.push(sets[i]);
            }
        }

        // Reversed dates here so that the first workout session in the array is the latest session
        parse.dates.reverse();

        return parse;

    }

    const addCardioData = (sessions) => {
        let datesCopy = [...parsedData.dates];

        for (let i = 0; i < sessions.length; i++) {
            for (let j = 0; j < datesCopy.length; j++) {
                if (sessions[i].date == datesCopy[j].date) {
                    datesCopy[j].cardioSessions.push(sessions[i]);
                }
            }
        }

        setParsedData({dates: datesCopy});

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