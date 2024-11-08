import { View, Text, TextInput, KeyboardAvoidingView, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { globalStyles, globalStyleVariables } from '../../../../styles/styles';
import { TouchableOpacity } from 'react-native';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../../../firebase/FirebaseConfig';

function AddWeight({ navigation }) {
    const [weight, setWeight] = useState("");
    const [loading, setLoading] = useState(false);
    const date = new Date().toLocaleDateString();
    const docRef = doc(db, "weightTracker", auth.currentUser.uid);

    const addData = async () => {
        if (weight == "") alert("Your weight field is empty!");
        else {
            setLoading(true);
            try {
                const snapshot = await getDoc(docRef);
                if (snapshot.exists()) {
                    let toLog = { weight: parseFloat(weight), date: date };
                    let weights = snapshot.data().weights;
                    weights = [...weights, toLog];
                    await updateDoc(docRef, { weights: weights });
                } else {
                    let toLog = { weights: [{ weight: parseFloat(weight), date: date }] };
                    await setDoc(docRef, toLog);
                }

                navigation.navigate("ProgressTracker");

            } catch (error) {
                alert(error.message);
            }
        }
    }

    const onlyNumbers = (text) => {
        let numericValue = text.replace(/[^0-9.]/g, "");
        numericValue = numericValue.replace(/(\..*)\./g, "$1");
        return numericValue;
    }

    return (
        <View style={globalStyles.container}>
            <KeyboardAvoidingView>
                <Text style={globalStyles.screenTitle}>Add Weigh-In</Text>
                <Text style={globalStyles.screenSubtitle}>Add your weight for {date}</Text>
                <View style={globalStyles.formWrapper}>
                    <TextInput style={globalStyles.inputText} placeholder="Weight (lbs)" placeholderTextColor={globalStyleVariables.outlineColor} value={weight} onChangeText={(text) => setWeight(onlyNumbers(text))} />
                    {loading ? (<ActivityIndicator size='large' color={globalStyleVariables.textColor} />) :
                        (
                            <View style={globalStyles.formButtonRowWrapper}>
                                <TouchableOpacity style={globalStyles.button} onPress={() => addData()}>
                                    <Text style={globalStyles.buttonTitle}>Log Weight</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={globalStyles.button} onPress={() => navigation.goBack()}>
                                    <Text style={globalStyles.buttonTitle}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}

export default AddWeight;