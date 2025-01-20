import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native'
import React, { useCallback, useState } from 'react'
import { globalStyles, globalStyleVariables } from '../../../../styles/styles';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../../firebase/FirebaseConfig';
import { useFocusEffect } from '@react-navigation/native';
import DateReviewListItem from '../../../../components/workouts/DateReviewListItem';
import CalendarView from '../../../../components/calendar/CalendarView';
import { parseMonth, parseYear } from '../../../../components/calendar/DateFormatting';

function WorkoutTracker(props) {
    const navigation = props.navigation;
    const docRef = doc(db, "dataTracker", auth.currentUser.uid);
    const [loading, setLoading] = useState(false);
    const [dates, setDates] = useState([]);
    const [openDateIndex, setOpenDateIndex] = useState(0);

    useFocusEffect(
        useCallback(() => {

            const loadData = async () => {
                setLoading(true);
                try {
                    const snapshot = await getDoc(docRef);
                    if (snapshot.exists()) {
                        const data = snapshot.data();
                        setDates(data.dates.reverse());
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

    const returnHeader = () => {
        if (!loading)
            return (
                <></>
            )
    }

    const findDateIndex = (date) => {
        for (let i = 0; i < dates.length; i++) {
            if (dates[i].date == date.toLocaleDateString()) return i;
        }
        return -1;
    }

    const dateSelected = (date) => {
        setOpenDateIndex(findDateIndex(date));
    }

    const returnBody = () => {
        if (loading)
            return (<ActivityIndicator size='large' color={globalStyleVariables.textColor} />);
        if (dates.length == 0)
            return (<Text style={globalStyles.formText}>No training recorded yet!</Text>);
        if (dates != undefined)
            return (
                <>
                    {returnHeader()}
                    <CalendarView selectedDate={dates[openDateIndex].date} dates={dates} selectAction={(date) => dateSelected(date)} />
                    <DateReviewListItem dateData={dates[openDateIndex]} navigation={navigation} />
                </>
            )
        // return dates.map((date, index) => {
        //     if (date.sets.length > 0 || date.cardioLogs.length > 0) {
        //         return (
        //             <DateReviewListItem key={index} dateData={date} navigation={navigation} />
        //         )
        //     }
        // })
    }

    return (
        <ScrollView>
            {returnBody()}
        </ScrollView>
    )
}

export default WorkoutTracker;