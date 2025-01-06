import { View, Text, TextInput, KeyboardAvoidingView, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { globalStyles, globalStyleVariables } from '../../../../styles/styles';
import { TouchableOpacity } from 'react-native';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../../../firebase/FirebaseConfig';

function LogCardio({ navigation }) {
    const [type, setType] = useState("");
    const [time, setTime] = useState("");
    const [caloriesBurned, setCaloriesBurned] = useState("");
    const [loading, setLoading] = useState(false);
    const date = new Date().toLocaleDateString();
    const docRef = doc(db, "cardioTracker", auth.currentUser.uid);

    const addData = async () => {
        if (type == "" || time == "" || caloriesBurned == "") alert("Make sure you've filled out everything before submitting!");
        else {
            setLoading(true);
            try {
                const snapshot = await getDoc(docRef);
                if (snapshot.exists()) {
                    let toLog = { type: type, time: parseFloat(time), caloriesBurned: caloriesBurned, date: date };
                    let sessions = snapshot.data().sessions;
                    sessions = [...sessions, toLog];
                    await updateDoc(docRef, { sessions: sessions });
                } else {
                    let toLog = { sessions: [{ type: type, time: parseFloat(time), caloriesBurned: caloriesBurned, date: date }] };
                    await setDoc(docRef, toLog);
                }

                navigation.goBack();

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
                <Text style={globalStyles.screenTitle}>Log Cardio</Text>
                <Text style={globalStyles.screenSubtitle}>Log your cardio for {date}</Text>
                <View style={globalStyles.formWrapper}>
                    <TextInput style={globalStyles.textInput} placeholder="Type" placeholderTextColor={globalStyleVariables.outlineColor} value={type} onChangeText={(text) => setType(text)} />
                    <TextInput style={globalStyles.textInput} placeholder="Time (minutes)" placeholderTextColor={globalStyleVariables.outlineColor} value={time} onChangeText={(text) => setTime(onlyNumbers(text))} />
                    <TextInput style={globalStyles.textInput} placeholder="Calories Burned" placeholderTextColor={globalStyleVariables.outlineColor} value={caloriesBurned} onChangeText={(text) => setCaloriesBurned(onlyNumbers(text))} />
                    {loading ? (<ActivityIndicator size='large' color={globalStyleVariables.textColor} />) :
                        (
                            <View style={globalStyles.rowSpacingWrapper}>
                                <TouchableOpacity style={globalStyles.button} onPress={() => addData()}>
                                    <Text style={globalStyles.buttonTitle}>Log Cardio</Text>
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

export default LogCardio;