import { View, Text, TouchableOpacity } from 'react-native'
import React, { useCallback, useState } from 'react'
import { globalStyles } from '../../../../styles/styles';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import auth from '../../../../firebase/FirebaseConfig';
import { useFocusEffect } from '@react-navigation/native';

function WeightTracker(props) {
    const [weights, setWeights] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigation = props.navigation;
    const date = new Date().toLocaleDateString();
    const db = getFirestore();
    const docRef = doc(db, "weightTracker", auth.currentUser.uid);

    // I don't know exactly how this hook works, but it's the only way I've been able to make sure the data displayed on-screen is up to date
    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                setLoading(true);
                try {
                    const snapshot = await getDoc(docRef);
                    if (snapshot.exists) {
                        setWeights(snapshot.data().weights);
                    }
                } catch (error) {
                    alert(error.message);
                }
                setLoading(false);
            }
            loadData();
        }, [])
    )

    return (
        <View style={globalStyles.formWrapper}>
            <View style={globalStyles.formButtonRowWrapper}>
                <Text style={globalStyles.formTitle}>Weight Tracker</Text>
                <TouchableOpacity style={globalStyles.button} onPress={() => navigation.navigate("AddWeight")}>
                    <Text style={globalStyles.buttonTitle}>Weigh-In</Text>
                </TouchableOpacity>
            </View>

            {
                weights == [] || weights.length == 0 || weights == undefined ?
                    (<Text style={globalStyles.formText}>No weigh-ins tracked yet!</Text>)
                    :
                    weights.map((weight, index) => {
                        return (<Text key={index} style={globalStyles.formText}>{weight.date + ": " + weight.weight} lbs</Text>)
                    })

            }

        </View>
    )
}

export default WeightTracker;