import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native'
import React, { useCallback, useState } from 'react'
import { globalStyles, globalStyleVariables } from '../../../../styles/styles';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../../firebase/FirebaseConfig';
import { useFocusEffect } from '@react-navigation/native';

function WeightTracker(props) {
    const [weights, setWeights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [docExists, setDocExists] = useState(false);
    const navigation = props.navigation;
    const docRef = doc(db, "weightTracker", auth.currentUser.uid);

    // I don't know exactly how this hook works, but it's the only way I've been able to make sure the data displayed on-screen is up to date
    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                setLoading(true);
                try {
                    const snapshot = await getDoc(docRef);
                    if (snapshot.exists()) {
                        setWeights(snapshot.data().weights);
                        setDocExists(true);
                        setLoading(false);
                    } else {
                        setDocExists(false);
                        setLoading(false);
                    }
                } catch (error) {
                    alert(error.message);
                }
            }
            loadData();
        }, [])
    )

    return (
        <View style={[globalStyles.formWrapper, { maxHeight: "45%" }]}>
            <View style={globalStyles.rowSpacingWrapper}>
                <Text style={globalStyles.formTitle}>Body Weight Tracker</Text>
                <TouchableOpacity style={globalStyles.button} onPress={() => navigation.navigate("AddWeight")}>
                    <Text style={globalStyles.buttonTitle}>Weigh-In</Text>
                </TouchableOpacity>
            </View>
            <ScrollView>
                {
                    loading ? (<ActivityIndicator size='large' color={globalStyleVariables.textColor} />) :
                        docExists && weights.length > 0 ?
                            weights.map((weight, index) => {
                                return (<Text key={index} style={globalStyles.formText}>{weight.date + ": " + weight.weight} lbs</Text>)
                            })
                            :
                            (<Text style={globalStyles.formText}>No weigh-ins tracked yet!</Text>)

                }
            </ScrollView>
        </View>
    )
}

export default WeightTracker;