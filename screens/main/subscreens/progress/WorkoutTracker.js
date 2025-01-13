import { View, Text, ActivityIndicator, ScrollView } from 'react-native'
import React, { useCallback, useState } from 'react'
import { globalStyles, globalStyleVariables } from '../../../../styles/styles';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../../../firebase/FirebaseConfig';
import { useFocusEffect } from '@react-navigation/native';
import DateReviewListItem from '../../../../components/workouts/DateReviewListItem';

function WorkoutTracker(props) {
    const navigation = props.navigation;
    const docRef = doc(db, "dataTracker", auth.currentUser.uid);
    const [loading, setLoading] = useState(false);
    const [dates, setDates] = useState([]);

    useFocusEffect(
        useCallback(() => {

            const loadData = async () => {
                setLoading(true);
                try {
                    const snapshot = await getDoc(docRef);
                    if (snapshot.exists()) {
                        const data = snapshot.data();
                        setDates(data.dates);
                    } else {
                        setDates([]);
                    }
                } catch (error) {
                    alert("Failed to load training data: " + error.message);
                }
                setLoading(false);
            }

            loadData();

        }, [])
    )

    const returnBody = () => {
        if (loading)
            return (<ActivityIndicator size='large' color={globalStyleVariables.textColor} />);
        if (dates.length == 0)
            return (<Text style={globalStyles.formText}>No workouts recorded yet!</Text>);
        return dates.reverse().map((date, index) => {
            if (date.sets.length > 0 || date.cardioLogs.length > 0) {
                return (
                    <DateReviewListItem key={index} dateData={date} navigation={navigation} />
                )
            }
        })
    }

    return (
        <ScrollView>
            {returnBody()}
        </ScrollView>
    )
}

export default WorkoutTracker;