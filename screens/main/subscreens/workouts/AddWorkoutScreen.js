import { View, Text, TextInput, KeyboardAvoidingView, ActivityIndicator } from 'react-native'
import React, { useCallback, useState } from 'react'
import { globalStyles, globalStyleVariables } from '../../../../styles/styles';
import { TouchableOpacity } from 'react-native';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../../../firebase/FirebaseConfig';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { blankGroupsList, blankWorkoutsDoc, cloneObject } from '../../../../data/DataStructures';

function AddWorkoutScreen({ navigation }) {
    const [wkoutName, setWkoutName] = useState("");
    const [weight, setWeight] = useState("");
    const [sets, setSets] = useState("");
    const [reps, setReps] = useState("");
    const [group, setGroup] = useState(1);
    const [loading, setLoading] = useState(false);
    const [groupsList, setGroupsList] = useState([]);
    const docRef = doc(db, "workouts", auth.currentUser.uid);

    useFocusEffect(
        useCallback(() => {
            const loadGroups = async () => {
                try {
                    const snapshot = await getDoc(docRef);
                    if (snapshot.exists()) {
                        const data = snapshot.data();
                        setGroupsList(data.groups);
                    } else {
                        setGroupsList([...blankGroupsList]);
                        await setDoc(docRef, cloneObject(blankWorkoutsDoc));
                    }
                } catch (error) {
                    alert(error.message);
                }
            }

            loadGroups();

        }, [])
    )

    const addData = async () => {
        if (wkoutName == "" || weight == "" || sets == "" || reps == "")
            alert("Make sure you've filled out everything before submitting!");
        else if (sets == "0")
            alert("You can't have a workout with zero sets!");
        else {
            setLoading(true);
            try {
                const snapshot = await getDoc(docRef);
                if (snapshot.exists()) {
                    let workouts = snapshot.data().workouts;
                    if (workoutNameAlreadyExists(workouts)) {
                        alert("Workout with that name already exists!")
                    } else {
                        let nextId;
                        if (workouts.length > 0)
                            nextId = workouts[workouts.length - 1] + 1;
                        else nextId = 0;
                        let toLog = { name: wkoutName, weight: parseFloat(weight), sets: parseFloat(sets), reps: parseFloat(reps), group: group, id: nextId };
                        workouts = [...workouts, toLog];
                        await updateDoc(docRef, { workouts: workouts });
                        navigation.goBack();
                    }
                } else {
                    let toLog = { name: wkoutName, weight: parseFloat(weight), sets: parseFloat(sets), reps: parseFloat(reps), group: group, id: 0 };
                    let newDoc = cloneObject(blankWorkoutsDoc);
                    newDoc.workouts.push(toLog);
                    await setDoc(docRef, newDoc);
                    navigation.goBack();
                }


            } catch (error) {
                alert(error.message);
            }
            setLoading(false);
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
                    <TextInput style={globalStyles.textInput} placeholder="Workout Name" placeholderTextColor={globalStyleVariables.outlineColor} autoCapitalize={"words"} value={wkoutName} onChangeText={(text) => setWkoutName(text)} />
                    <TextInput style={globalStyles.textInput} placeholder="Weight (lbs)" placeholderTextColor={globalStyleVariables.outlineColor} value={weight} onChangeText={(text) => setWeight(onlyNumbers(text))} />
                    <TextInput style={globalStyles.textInput} placeholder="Sets" placeholderTextColor={globalStyleVariables.outlineColor} value={sets} onChangeText={(text) => setSets(onlyNumbers(text))} />
                    <TextInput style={globalStyles.textInput} placeholder="Reps" placeholderTextColor={globalStyleVariables.outlineColor} value={reps} onChangeText={(text) => setReps(onlyNumbers(text))} />
                    <View style={globalStyles.textInput}>
                        <Picker
                            selectedValue={group}
                            onValueChange={(itemValue) => setGroup(itemValue)}
                            style={globalStyles.picker.pickerComponent}
                            dropdownIconColor={globalStyleVariables.textColor}
                            mode={"dropdown"}
                        >
                            {
                                groupsList.map((group, index) => {
                                    return (
                                        <Picker.Item key={index} style={globalStyles.picker.pickerItem} label={group.name} value={group.id} />
                                    )
                                })
                            }
                        </Picker>
                    </View>
                    <TouchableOpacity style={globalStyles.button} onPress={() => navigation.navigate("AddGroup")}>
                        <Text style={[globalStyles.buttonTitle, { alignSelf: 'center' }]}>Create New Group</Text>
                    </TouchableOpacity>
                    {loading ? (<ActivityIndicator size='large' color={globalStyleVariables.textColor} />) :
                        (
                            <View style={globalStyles.rowSpacingWrapper}>
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