import { View, Text, ScrollView } from 'react-native'
import React, { useCallback, useState } from 'react'
import { globalStyles, globalStyleVariables } from '../../../../styles/styles';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../../firebase/FirebaseConfig';
import { ActivityIndicator } from 'react-native';
import { TouchableOpacity } from 'react-native';
import SetsListItem from '../../../../components/workouts/SetsListItem';

function HistoricalReview({ navigation }) {
    const route = useRoute();
    const workoutObj = route.params.workoutObj;
    const trackerDocRef = doc(db, "workoutTracker", auth.currentUser.uid);
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
            if (obj.workoutId == workoutObj.id) {
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

    return (
        <View style={globalStyles.container}>
            <ScrollView>
                <Text style={globalStyles.screenTitle}>Historical Review</Text>
                <Text style={globalStyles.screenSubtitle}>Historical data for {workoutObj.name}</Text>
                {
                    parsedTracker && !loading ?
                        parsedTracker.map((date, index) => {
                            return (
                                <SetsListItem key={index} workoutData={workoutObj} sessionData={date} header={date.date} navigation={navigation} />
                            )

                        })
                        : (<ActivityIndicator size='large' color={globalStyleVariables.textColor} />)
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

export default HistoricalReview;