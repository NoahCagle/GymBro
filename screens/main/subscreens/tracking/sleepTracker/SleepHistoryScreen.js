import { View, Text, ActivityIndicator, ScrollView } from 'react-native'
import React, { useCallback, useState } from 'react'
import { globalStyles, globalStyleVariables } from '../../../../../styles/styles';
import { FAB } from '@rneui/base';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../../../firebase/FirebaseConfig';
import { useFocusEffect } from '@react-navigation/native';

function SleepHistoryScreen({ navigation }) {
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState([]);
    const docRef = doc(db, "dataTracker", auth.currentUser.uid);

    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                setLoading(true);
                try {
                    const snapshot = await getDoc(docRef);
                    if (snapshot.exists()) {
                        const data = snapshot.data();
                        setLogs(combineLogs(data.dates));
                    }
                } catch (error) {
                    alert("Failed to load sleep logs: " + error.message);
                }
                setLoading(false);
            }

            loadData();

        }, [])
    )

    const combineLogs = (dates) => {
        let ret = [];

        for (let i = 0; i < dates.length; i++) {
            let log = dates[i].sleepLog;
            if (log != null && log != undefined)
                ret = [...ret, dates[i].sleepLog];
        }

        return ret;
    }

    const listLogs = () => {
        if (logs.length == 0) {
            return (
                <Text style={globalStyles.screenSubtitle}>No sleep logs added yet</Text>
            )
        } else {
            return (
                <ScrollView>
                    {
                        logs.reverse().map((log, index) => {
                            return (
                                <View key={index} style={globalStyles.formWrapper}>
                                    <Text style={[globalStyles.formTitle, { textDecorationLine: 'underline' }]}>{log.date}</Text>
                                    <Text style={globalStyles.formText}>{log.hours} hours of sleep</Text>
                                </View>
                            )
                        })
                    }
                </ScrollView>
            )
        }
    }

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.screenTitleCentered}>Sleep Tracker</Text>

            {
                loading ? (<ActivityIndicator size='large' color={globalStyleVariables.textColor} />) : listLogs()
            }

            <FAB
                visible={true}
                placement='right'
                title={"+   Log Sleep"}
                color={globalStyleVariables.fabColor}
                onPress={() => navigation.navigate("LogSleep")}
            />

        </View>
    )
}

export default SleepHistoryScreen;