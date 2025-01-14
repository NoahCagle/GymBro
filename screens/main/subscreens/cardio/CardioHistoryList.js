import { View, Text, ActivityIndicator } from 'react-native'
import React, { useCallback, useState } from 'react'
import { globalStyles, globalStyleVariables } from '../../../../styles/styles';
import { SpeedDial } from '@rneui/base';
import { useFocusEffect } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../../firebase/FirebaseConfig';
import CardioListItem from '../../../../components/workouts/CardioListItem';

function CardioHistoryList({ navigation }) {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const docRef = doc(db, "dataTracker", auth.currentUser.uid);

    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                setLoading(true);
                try {
                    const snapshot = await getDoc(docRef);
                    if (snapshot.exists()) {
                        const data = snapshot.data();
                        setSessions(combineLogs(data.dates).reverse());
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

    const combineLogs = (dates) => {
        let ret = [];
        for (let i = 0; i < dates.length; i++) {
            if (dates[i].cardioLogs.length > 0) {
                ret = [...ret, ...dates[i].cardioLogs];
            }
        }
        return ret;
    }

    const listSessions = () => {
        if (sessions.length == 0) {
            return (
                <Text style={globalStyles.screenSubtitle}>No cardio sessions logged yet</Text>
            )
        } else {
            return (
                <View>
                    {
                        sessions.map((session, index) => {
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

            {
                loading ? (<ActivityIndicator size='large' color={globalStyleVariables.textColor} />) :
                    listSessions()
            }

            <SpeedDial
                isOpen={menuOpen}
                icon={{ name: 'edit', color: '#fff' }}
                openIcon={{ name: 'close', color: '#fff' }}
                onOpen={() => setMenuOpen(!menuOpen)}
                onClose={() => setMenuOpen(!menuOpen)}
                color={globalStyleVariables.fabColor}
                overlayColor={globalStyleVariables.transparent}
                labelPressable={true}
            >
                <SpeedDial.Action
                    icon={{ name: 'add', color: '#fff' }}
                    title="Log Cardio"
                    color={globalStyleVariables.fabColor}
                    onPress={() => {
                        setMenuOpen(false);
                        navigation.navigate("LogCardio");
                    }}
                />
                <SpeedDial.Action
                    icon={{ name: 'add', color: '#fff' }}
                    title="Create Cardio Type"
                    color={globalStyleVariables.fabColor}
                    onPress={() => {
                        setMenuOpen(false);
                        navigation.navigate("AddCardioType");
                    }}
                />
            </SpeedDial>

        </View>
    )
}

export default CardioHistoryList;