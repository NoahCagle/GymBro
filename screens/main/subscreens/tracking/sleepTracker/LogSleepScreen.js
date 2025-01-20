import { View, Text, TextInput, KeyboardAvoidingView, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../../../../firebase/FirebaseConfig';
import { blankDate, cloneObject } from '../../../../../data/DataStructures';
import { globalStyles, globalStyleVariables } from '../../../../../styles/styles';

function LogSleepScreen({ navigation }) {
    const [hours, setHours] = useState();
    const [loading, setLoading] = useState(false);
    const date = new Date().toLocaleDateString();
    const docRef = doc(db, "dataTracker", auth.currentUser.uid);

    const addData = async () => {
        if (hours == "")
            alert("Make sure to fill out the form!");
        else {
            setLoading(true);
            try {
                const snapshot = await getDoc(docRef);
                let toLog = { date: date, hours: parseFloat(hours) };
                if (snapshot.exists()) {
                    const data = snapshot.data();
                    let dates = data.dates;
                    const dateIndex = findCurrentDateIndex(dates);
                    if (dateIndex != -1) {
                        dates[dateIndex].sleepLog = toLog;
                    } else {
                        let newDate = cloneObject(blankDate);
                        newDate.sleepLog = toLog;
                        dates.push(newDate);
                    }
                    await updateDoc(docRef, { dates: dates });
                } else {
                    let newDate = cloneObject(blankDate);
                    newDate.sleepLog = toLog;
                    await setDoc(docRef, { dates: [newDate] });
                }

                navigation.goBack();

            } catch (error) {
                alert(error.message);
            }
            setLoading(false);
        }
    }

    const findCurrentDateIndex = (dates) => {
        let ret = -1;
        for (let i = 0; i < dates.length; i++) {
            if (dates[i].date == date) {
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
                <Text style={globalStyles.screenTitle}>Log Sleep</Text>
                <Text style={globalStyles.screenSubtitle}>Logging sleep for {date}</Text>
                <View style={globalStyles.formWrapper}>
                    <TextInput style={globalStyles.textInput} placeholder="Hours of sleep" placeholderTextColor={globalStyleVariables.outlineColor} autoCapitalize={"words"} value={hours} onChangeText={(text) => setHours(onlyNumbers(text))} />
                    {loading ? (<ActivityIndicator size='large' color={globalStyleVariables.textColor} />) :
                        (
                            <View style={globalStyles.rowSpacingWrapper}>
                                <TouchableOpacity style={globalStyles.button} onPress={() => addData()}>
                                    <Text style={globalStyles.buttonTitle}>Log Sleep</Text>
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

export default LogSleepScreen;