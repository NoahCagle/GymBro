import { View, Text, TextInput, KeyboardAvoidingView, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { globalStyles, globalStyleVariables } from '../../../../styles/styles';
import { TouchableOpacity } from 'react-native';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../../../firebase/FirebaseConfig';

function LogSleepScreen({ navigation }) {
    const [hours, setHours] = useState();
    const [loading, setLoading] = useState(false);
    const date = new Date().toLocaleDateString();
    const docRef = doc(db, "sleepTracker", auth.currentUser.uid);

    const addData = async () => {
        if (hours == "")
            alert("Your group needs a name!");
        else {
            setLoading(true);
            try {
                const snapshot = await getDoc(docRef);
                if (snapshot.exists()) {
                    const data = snapshot.data();
                    const logs = data.logs;
                    await updateDoc(docRef, { logs: [...logs, { date: date, hours: parseFloat(hours) }] });
                } else {
                    await setDoc(docRef, { logs: [{ date: date, hours: parseFloat(hours) }] });
                }

                navigation.goBack();

            } catch (error) {
                alert(error.message);
            }
            setLoading(false);
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