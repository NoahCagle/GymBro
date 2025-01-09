import { View, Text, ActivityIndicator } from 'react-native'
import React, { useCallback, useState } from 'react'
import { globalStyles, globalStyleVariables } from '../../../../styles/styles';
import { FAB } from '@rneui/base';
import { useFocusEffect } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../../firebase/FirebaseConfig';
import CardioListItem from '../../../../components/workouts/CardioListItem';

function CardioHistoryList({ navigation }) {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(false);
    const docRef = doc(db, "cardioTracker", auth.currentUser.uid);

    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                setLoading(true);
                try {
                    const snapshot = await getDoc(docRef);
                    if (snapshot.exists()) {
                        const data = snapshot.data();
                        setSessions(data.sessions);
                    } else {
                        setSessions([]);
                    }
                } catch (error) {
                    alert("Failed to load cardio history: " + error.message);
                }
                setLoading(false);
            }

            loadData();

        }, [])
    );

    const listSessions = () => {
        if (sessions.length == 0) {
            return (
                <Text style={globalStyles.screenSubtitle}>No cardio sessions logged yet</Text>
            )
        } else {
            return (
                <View>
                    {
                        sessions.reverse().map((session, index) => {
                            return (
                                <CardioListItem key={index} session={session} headerPrefix={session.date + ": "} />
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

            {loading ? (<ActivityIndicator size='large' color={globalStyleVariables.textColor} />) :
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