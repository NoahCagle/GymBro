import { View, Text, ActivityIndicator } from 'react-native'
import React, { useCallback, useState } from 'react'
import { globalStyles, globalStyleVariables } from '../../../../styles/styles';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../../firebase/FirebaseConfig';
import { useFocusEffect } from '@react-navigation/native';

function WorkoutTracker(props) {
    const navigation = props.navigation;
    const docRef = doc(db, "workoutTracker", auth.currentUser.uid);
    const [loading, setLoading] = useState(false);
    const [sets, setSets] = useState([]);
    const [docExists, setDocExists] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                setLoading(true);
                try {
                    const snapshot = await getDoc(docRef);
                    if (snapshot.exists()) {
                        setDocExists(true);

                        const data = snapshot.data();

                        setSets(data.workouts);

                    } else
                        setDocExists(false);
                    setLoading(false);
                } catch (error) {
                    alert("Failed to load workouts: " + error.message)
                }
            }
            loadData();
        }, [])
    )

    return (
        <View style={globalStyles.formWrapper}>
            <Text style={globalStyles.formTitle}>Workout Tracker</Text>
            {
                loading ? (<ActivityIndicator size='large' color={globalStyleVariables.textColor} />) :
                    !docExists ? (<Text style={globalStyles.formText}>No workouts recorded yet!</Text>)
                        : 
                        sets.map((set, index) => {
                            return (
                                <Text key={index} style={globalStyles.formText}>{set.date}: {set.name} at {set.weight} lbs for {set.reps} reps</Text>
                            )
                        })
            }
        </View>
    )
}

export default WorkoutTracker;