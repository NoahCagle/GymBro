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
                <View style={globalStyles.rowSpacingWrapper}>

                    <TouchableOpacity onPress={() => {
                        setOpenDateIndex(dates.length - 1);
                    }}>
                        <Text style={globalStyles.screenTitleCentered}>{"◄◄"}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        if (openDateIndex < (dates.length - 1)) setOpenDateIndex(openDateIndex + 1);
                    }}>
                        <Text style={globalStyles.screenTitleCentered}>{"◄"}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <Text style={globalStyles.screenTitleCentered}>{dates[openDateIndex].date}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        if (openDateIndex >= 1) setOpenDateIndex(openDateIndex - 1);
                    }}>
                        <Text style={globalStyles.screenTitleCentered}>{"►"}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        setOpenDateIndex(0);
                    }}>
                        <Text style={globalStyles.screenTitleCentered}>{"►►"}</Text>
                    </TouchableOpacity>

                </View>
            )
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
                    <CalendarView month={parseMonth(dates[openDateIndex].date)} year={parseYear(dates[openDateIndex].date)} />
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