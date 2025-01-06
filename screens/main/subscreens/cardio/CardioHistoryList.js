import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { globalStyles, globalStyleVariables } from '../../../../styles/styles';
import { FAB } from '@rneui/base';
import { useFocusEffect } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../../firebase/FirebaseConfig';

function CardioHistoryList({ navigation }) {
    const [sessions, setSessions] = useState([]);
    const docRef = doc(db, "cardioTracker", auth.currentUser.uid);

    useFocusEffect(() => {
        const loadData = async () => {
            try {
                const snapshot = await getDoc(docRef);
                if (snapshot.exists()) {
                    const data = snapshot.data();
                    setSessions(data.sessions);
                }
            } catch (error) {
                alert("Failed to load cardio history: " + error.message);
            }
        }

        loadData();

    });

    const listSessions = () => {
        if (sessions.length == 0) {
            return (
                <Text style={globalStyles.screenSubtitle}>No sessions logged yet</Text>
            )
        } else {
            return (
                <View>
                    {
                        sessions.map((sessions, index) => {
                            return (
                                <View key={index} style={globalStyles.formWrapper}>
                                    <Text style={[globalStyles.formTitle, {textDecorationLine: 'underline'}]}>{sessions.date}: {sessions.type}</Text>
                                    <Text style={globalStyles.formText}>{sessions.time} minutes</Text>
                                    <Text style={globalStyles.formText}>{sessions.caloriesBurned} calories burned</Text>
                                </View>
                            )
                        })
                    }
                </View>
            )
        }
    }

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.screenTitle}>Cardio History</Text>

            {
                listSessions()
            }

            <FAB
                visible={true}
                placement='right'
                title={"+   Log Cardio"}
                color={globalStyleVariables.fabColor}
                onPress={() => navigation.navigate("Log Cardio")}
            />

        </View>
    )
}

export default CardioHistoryList;