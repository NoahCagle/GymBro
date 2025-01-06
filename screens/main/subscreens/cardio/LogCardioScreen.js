import { View, Text, TextInput, KeyboardAvoidingView, ActivityIndicator } from 'react-native'
import React, { useCallback, useState } from 'react'
import { globalStyles, globalStyleVariables } from '../../../../styles/styles';
import { TouchableOpacity } from 'react-native';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../../../firebase/FirebaseConfig';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';

function LogCardio({ navigation }) {
    const [type, setType] = useState(1);
    const [time, setTime] = useState("");
    const [caloriesBurned, setCaloriesBurned] = useState("");
    const [typesList, setTypesList] = useState([]);
    const [loading, setLoading] = useState(false);
    const date = new Date().toLocaleDateString();
    const docRef = doc(db, "cardioTracker", auth.currentUser.uid);

    useFocusEffect(
        useCallback(() => {
            const loadCardioTypes = async () => {
                try {
                    const snapshot = await getDoc(docRef);
                    if (snapshot.exists()) {
                        const types = snapshot.data().types;
                        if (types.length == 0)
                            setTypesList([{ name: "No Type", id: 1 }]);
                        else
                            setTypesList(types);
                    } else {
                        setTypesList([{ name: "No Type", id: 1 }]);
                    }
                } catch (error) {
                    alert("Failed to load cardio types list: " + error.message);
                }
            }

            loadCardioTypes();

        }, [])
    )

    const addData = async () => {
        if (time == "" || caloriesBurned == "") alert("Make sure you've filled out everything before submitting!");
        else {
            setLoading(true);
            try {
                const snapshot = await getDoc(docRef);
                if (snapshot.exists()) {
                    let typeName = getTypeName(type);
                    let toLog = { typeId: type, typeName: typeName, time: parseFloat(time), caloriesBurned: caloriesBurned, date: date };
                    let sessions = snapshot.data().sessions;
                    sessions = [...sessions, toLog];
                    await updateDoc(docRef, { sessions: sessions });
                } else {
                    let typeName = getTypeName(type);
                    let toLog = { types: typesList, sessions: [{ typeId: type, typeName: typeName, time: parseFloat(time), caloriesBurned: caloriesBurned, date: date }] };
                    await setDoc(docRef, toLog);
                }

                navigation.goBack();

            } catch (error) {
                alert(error.message);
            }
            setLoading(false);
        }
    }

    const getTypeName = (typeId) => {
        let ret = "";
        typesList.forEach((type) => {
            if (type.id == typeId) {
                ret = type.name;
            }
        })
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
                <Text style={globalStyles.screenTitle}>Log Cardio</Text>
                <Text style={globalStyles.screenSubtitle}>Log your cardio for {date}</Text>
                <View style={globalStyles.formWrapper}>
                    <View style={globalStyles.textInput}>
                        <Picker
                            selectedValue={type}
                            onValueChange={(itemValue) => setType(itemValue)}
                            style={globalStyles.picker.pickerComponent}
                            dropdownIconColor={globalStyleVariables.textColor}
                            mode={"dropdown"}
                        >
                            {
                                typesList.map((type, index) => {
                                    return (
                                        <Picker.Item key={index} style={globalStyles.picker.pickerItem} label={type.name} value={type.id} />
                                    )
                                })
                            }
                        </Picker>
                    </View>
                    <TouchableOpacity style={globalStyles.button} onPress={() => navigation.navigate("Add Cardio Type")}>
                        <Text style={[globalStyles.buttonTitle, { alignSelf: 'center' }]}>Create Cardio Type</Text>
                    </TouchableOpacity>
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