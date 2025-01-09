import { View, Text, ActivityIndicator, ScrollView } from 'react-native'
import React, { useCallback, useState } from 'react'
import { globalStyles, globalStyleVariables } from '../../../../styles/styles';
import { FAB } from '@rneui/base';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../../firebase/FirebaseConfig';
import { useFocusEffect } from '@react-navigation/native';

function SorenessHistoryScreen({ navigation }) {
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState([]);
    const docRef = doc(db, "sorenessTracker", auth.currentUser.uid);

    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                setLoading(true);
                try {
                    const snapshot = await getDoc(docRef);
                    if (snapshot.exists()) {
                        const data = snapshot.data();
                        setLogs(data.logs);
                    }
                } catch (error) {
                    alert("Failed to load soreness logs: " + error.message);
                }
                setLoading(false);
            }

            loadData();

        }, [])
    )

    const sorenessMessage = (soreness) => {
        switch (soreness) {
            case 1:
                return "Not sore at all";
            case 2:
                return "Barely sore";
            case 3:
                return "Mildly sore";
            case 4:
                return "Properly sore";
            case 5:
                return "Too sore";
        }
    }

    const listLogs = () => {
        if (logs.length == 0) {
            return (
                <Text style={globalStyles.screenSubtitle}>No soreness logs added yet</Text>
            )
        } else {
            return (
                <ScrollView>
                    {
                        logs.reverse().map((log, index) => {
                            return (
                                <View key={index} style={globalStyles.formWrapper}>
                                    <Text style={[globalStyles.formTitle, { textDecorationLine: 'underline' }]}>{log.date}</Text>
                                    <Text style={globalStyles.formText}>Logged level {log.soreness} soreness - {sorenessMessage(log.soreness)}</Text>
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
            <Text style={globalStyles.screenTitle}>Soreness Logs</Text>

            {
                loading ? (<ActivityIndicator size='large' color={globalStyleVariables.textColor} />) : listLogs()
            }

            <FAB
                visible={true}
                placement='right'
                title={"+   Log Soreness"}
                color={globalStyleVariables.fabColor}
                onPress={() => navigation.navigate("LogSoreness")}
            />

        </View>
    )
}

export default SorenessHistoryScreen;