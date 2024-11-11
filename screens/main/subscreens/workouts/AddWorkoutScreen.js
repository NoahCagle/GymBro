import { View, Text, TextInput, KeyboardAvoidingView, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { globalStyles, globalStyleVariables } from '../../../../styles/styles';
import { TouchableOpacity } from 'react-native';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../../../firebase/FirebaseConfig';

function AddWorkoutScreen({ navigation }) {
    const [wkoutName, setWkoutName] = useState("");
    const [weight, setWeight] = useState("");
    const [sets, setSets] = useState("");
    const [reps, setReps] = useState("");
    const [loading, setLoading] = useState(false);
    const docRef = doc(db, "workouts", auth.currentUser.uid);

    const addData = async () => {
        if (wkoutName == "" || weight == "" || sets == "" || reps == "") {
            alert("Make sure you've filled out everything before submitting!");
        } else {
            setLoading(true);
            try {
                const snapshot = await getDoc(docRef);
                if (snapshot.exists()) {
                    let workouts = snapshot.data().workouts;
                    const nextId = workouts[workouts.length - 1].id + 1;
                    if (workoutNameAlreadyExists(workouts)) {
                        alert("Workout with that name already exists!")
                    } else {
                        let toLog = { name: wkoutName, weight: parseFloat(weight), sets: parseFloat(sets), reps: parseFloat(reps), id: nextId };
                        workouts = [...workouts, toLog];
                        await updateDoc(docRef, { workouts: workouts });
                        navigation.navigate("WorkoutsNavigator");
                    }
                } else {
                    let toLog = { workouts: [{ name: wkoutName, weight: parseFloat(weight), sets: parseFloat(sets), reps: parseFloat(reps), id: 0 }] };
                    await setDoc(docRef, toLog);
                }


            } catch (error) {
                alert(error.message);
            }
        }
    }

    const workoutNameAlreadyExists = (workouts) => {
        for (let i = 0; i < workouts.length; i++) {
            if (workouts[i].name == wkoutName) return true;
        }
        return false;
    }

    const onlyNumbers = (text) => {
        let numericValue = text.replace(/[^0-9.]/g, "");
        numericValue = numericValue.replace(/(\..*)\./g, "$1");
        return numericValue;
    }

    return (
        <View style={globalStyles.container}>
            <KeyboardAvoidingView>
                <Text style={globalStyles.screenTitle}>Add Workout</Text>
                <View style={globalStyles.formWrapper}>
                    <TextInput style={globalStyles.inputText} placeholder="Workout Name" placeholderTextColor={globalStyleVariables.outlineColor} autoCapitalize={"words"} value={wkoutName} onChangeText={(text) => setWkoutName(text)} />
                    <TextInput style={globalStyles.inputText} placeholder="Weight (lbs)" placeholderTextColor={globalStyleVariables.outlineColor} value={weight} onChangeText={(text) => setWeight(onlyNumbers(text))} />
                    <TextInput style={globalStyles.inputText} placeholder="Sets" placeholderTextColor={globalStyleVariables.outlineColor} value={sets} onChangeText={(text) => setSets(onlyNumbers(text))} />
                    <TextInput style={globalStyles.inputText} placeholder="Reps" placeholderTextColor={globalStyleVariables.outlineColor} value={reps} onChangeText={(text) => setReps(onlyNumbers(text))} />
                    {loading ? (<ActivityIndicator size='large' color={globalStyleVariables.textColor} />) :
                        (
                            <View style={globalStyles.formButtonRowWrapper}>
                                <TouchableOpacity style={globalStyles.button} onPress={() => addData()}>
                                    <Text style={globalStyles.buttonTitle}>Add Workout</Text>
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

export default AddWorkoutScreen;