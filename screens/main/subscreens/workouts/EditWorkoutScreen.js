import { View, Text, TextInput, KeyboardAvoidingView, ActivityIndicator } from 'react-native'
import React, { useCallback, useState } from 'react'
import { globalStyles, globalStyleVariables } from '../../../../styles/styles';
import { TouchableOpacity } from 'react-native';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../../../firebase/FirebaseConfig';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

function EditWorkoutScreen({ navigation }) {
    const route = useRoute();
    const id = route.params?.id;
    const [wkoutName, setWkoutName] = useState(route.params?.name);
    const [weight, setWeight] = useState("" + route.params?.weight);
    const [sets, setSets] = useState("" + route.params?.sets);
    const [reps, setReps] = useState("" + route.params?.reps);
    const [group, setGroup] = useState(route.params?.group);
    const [loading, setLoading] = useState(false);
    const [groupList, setGroupsList] = useState([]);
    const docRef = doc(db, "workouts", auth.currentUser.uid);

    useFocusEffect(
        useCallback(() => {
            const loadGroups = async () => {
                try {
                    const snapshot = await getDoc(docRef);
                    if (snapshot.exists()) {
                        const gs = snapshot.data().groups;
                        let temp = [];
                        gs.map((group) => {
                            temp.push(group);
                        })
                        setGroupsList(temp);
                    } else {
                        setGroupsList([{ id: -1, name: "No Group" }])
                    }
                } catch (error) {
                    alert(error.message);
                }
            }
            loadGroups();
        }, [])
    )

    const submitEdits = async () => {
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
                    let editedWorkout = { name: wkoutName, weight: parseFloat(weight), sets: parseFloat(sets), reps: parseFloat(reps), group: group, id: id };
                    const index = findIndexById(workouts);
                    workouts[index] = editedWorkout;
                    await updateDoc(docRef, { workouts: workouts });
                    navigation.goBack();
                } else {
                    // The document should always exist if the user ends up on the EditWorkoutScreen, however I've left this check just in case
                    let toLog = { workouts: [{ name: wkoutName, weight: parseFloat(weight), sets: parseFloat(sets), reps: parseFloat(reps), group: group, id: 0 }] };
                    await setDoc(docRef, toLog);
                    setLoading(false);
                    navigation.goBack();
                }


            } catch (error) {
                alert(error.message);
                setLoading(false);
            }
        }
    }

    // Finds the index of this workout within the 'workouts' array stored in Firebase
    const findIndexById = (workouts) => {
        let ret = -1;
        for (let i = 0; i < workouts.length; i++) {
            if (workouts[i].id == id) {
                ret = i;
                break;
            }
        }
        return ret;
    }

    const onlyNumbers = (text) => {
        let numericValue = text.replace(/[^0-9.]/g, "");
        numericValue = numericValue.replace(/(\..*)\./g, "$1");
        return numericValue;
    }

    return (
        <View style={globalStyles.container}>
            <KeyboardAvoidingView>
                <Text style={globalStyles.screenTitle}>Edit Workout</Text>
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
                                groupList.map((group, index) => {
                                    return (
                                        <Picker.Item key={index} style={globalStyles.picker.pickerItem} label={group.name} value={group.id} />
                                    )
                                })
                            }
                        </Picker>
                    </View>
                    {loading ? (<ActivityIndicator size='large' color={globalStyleVariables.textColor} />) :
                        (
                            <View style={globalStyles.rowSpacingWrapper}>
                                <TouchableOpacity style={globalStyles.button} onPress={() => submitEdits()}>
                                    <Text style={globalStyles.buttonTitle}>Apply Edits</Text>
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

export default EditWorkoutScreen;