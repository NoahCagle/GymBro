import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useCallback, useState } from 'react'
import { globalStyles, globalStyleVariables } from '../../../../styles/styles';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../../firebase/FirebaseConfig';
import { useFocusEffect } from '@react-navigation/native';

function WeightTracker(props) {
    const [weights, setWeights] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigation = props.navigation;
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
                loading ? (<ActivityIndicator size='large' color={globalStyleVariables.textColor} />) :
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