import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useCallback, useState } from 'react'
import { globalStyles, globalStyleVariables } from '../../../../../styles/styles';
import { Agenda } from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../../../firebase/FirebaseConfig';

function CalendarView() {
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [markedDates, setMarkedDates] = useState([]);
    const docRef = doc(db, "dataTracker", auth.currentUser.uid);

    const weightTrainingDot = { key: 'weightTrainingDot', color: 'red', selectedDotColor: 'blue' };
    const cardioTrainingDot = { key: 'cardioTrainingDot', color: 'blue', selectedDotColor: 'blue' };
    const weighInDot = { key: 'weighInDot', color: 'green' };

    useFocusEffect(
        useCallback(() => {

            const loadData = async () => {
                setLoading(true);
                try {
                    const snapshot = await getDoc(docRef);
                    if (snapshot.exists()) {
                        const data = snapshot.data();
                        await parseData(data.dates);
                        setLoading(false);
                    }
                } catch (error) {
                    alert("Failed to load data: " + error.message);
                }
            }

            loadData();

        }, [])
    )

    const parseData = async (dates) => {
        let is = {};
        let mDates = {};
        for (let i = 0; i < dates.length; i++) {
            let formattedDate = formatDate(dates[i].date);
            is[formattedDate] = createLists(dates[i]).items;
            mDates[formattedDate] = createLists(dates[i]).markedDates;
        }

        setItems(is);
        setMarkedDates(mDates);

    }

    const createLists = (date) => {
        let items = [];
        let markedDates = [];
        let sets = date.sets;
        let cardioLogs = date.cardioLogs;
        let weighins = date.bodyWeightLogs;

        if (sets.length > 0) {
            items.push({ name: 'Weight Training', data: sets.length + ' sets of weight training' });
            markedDates.push(weightTrainingDot);
        }

        if (cardioLogs.length > 0) {
            items.push({ name: 'Cardio', data: cardioLogs[0].time + ' minutes of cardio' })
            markedDates.push(cardioTrainingDot);
        }

        if (weighins.length > 0) {
            items.push({ name: 'Weigh-In', data: 'Weighed in at ' + weighins[0].weight + ' lbs' })
            markedDates.push(weighInDot);
        }

        return { items: items, markedDates: { dots: markedDates } };
    }

    const formatDate = (date) => {
        let split = date.split('/');
        let d = split[2] + '-' + (split[0].length == 1 ? ('0' + split[0]) : split[0]) + '-' + split[1]

        console.log(d);
        return d;
    }

    const returnCalendar = () => {
        if (loading)
            return (<ActivityIndicator size='large' color={globalStyleVariables.textColor} />)
        else
            return (
                <Agenda
                    items={items}
                    markingType={'multi-dot'}
                    markedDates={markedDates}
                    showClosingKnob={true}
                    hideKnob={false}
                    disabledByDefault={false}
                    renderEmptyData={() => {
                        return (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text>No events for this day</Text>
                        </View>)
                    }}
                    renderItem={(item, isFirst) => (
                        <AgendaItem item={item}></AgendaItem>
                    )}
                    theme={{
                        agendaKnobColor: '#000000'
                    }}
                />
            )
    }

    return (
        <View style={globalStyles.container}>
            {
                returnCalendar()
            }
        </View>
    )
}

function AgendaItem(props) {
    const item = props.item;
    return (
        <View style={globalStyles.formWrapper} >
            <Text style={globalStyles.formTitle}>{item.name}</Text>
            <Text style={globalStyles.formText}>{item.data}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
});

export default CalendarView;