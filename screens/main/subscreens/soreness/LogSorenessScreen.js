import { View, Text, TextInput, KeyboardAvoidingView, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { globalStyles, globalStyleVariables } from '../../../../styles/styles';
import { TouchableOpacity } from 'react-native';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../../../firebase/FirebaseConfig';
import { Picker } from '@react-native-picker/picker';

function LogSorenessScreen({ navigation }) {
    const [soreness, setSoreness] = useState(3);
    const [loading, setLoading] = useState(false);
    const date = new Date().toLocaleDateString();
    const docRef = doc(db, "sorenessTracker", auth.currentUser.uid);

    const addData = async () => {
        setLoading(true);
        try {
            const snapshot = await getDoc(docRef);
            if (snapshot.exists()) {
                const data = snapshot.data();
                const logs = data.logs;
                await updateDoc(docRef, { logs: [...logs, { date: date, soreness: soreness }] });
            } else {
                await setDoc(docRef, { logs: [{ date: date, soreness: soreness }] });
            }

            navigation.goBack();

        } catch (error) {
            alert(error.message);
        }
        setLoading(false);

    }

    return (
        <View style={globalStyles.container}>
            <KeyboardAvoidingView>
                <Text style={globalStyles.screenTitle}>Log Soreness</Text>
                <Text style={globalStyles.screenSubtitle}>Logging soreness on {date}</Text>
                <View style={globalStyles.formWrapper}>
                    <Text style={globalStyles.formSubtitle}>On a scale of 1 to 5, how sore are you from your last workout?</Text>
                    <Text style={globalStyles.formText}>1 - Not sore at all</Text>
                    <Text style={globalStyles.formText}>2 - Barely sore</Text>
                    <Text style={globalStyles.formText}>3 - Mildly sore</Text>
                    <Text style={globalStyles.formText}>4 - Properly sore</Text>
                    <Text style={globalStyles.formText}>5 - Too sore</Text>
                    <View style={globalStyles.textInput}>
                        <Picker
                            selectedValue={soreness}
                            onValueChange={(itemValue) => setSoreness(itemValue)}
                            style={globalStyles.picker.pickerComponent}
                            dropdownIconColor={globalStyleVariables.textColor}
                            mode={"dropdown"}
                        >
                            <Picker.Item style={globalStyles.picker.pickerItem} label={"1"} value={1} />
                            <Picker.Item style={globalStyles.picker.pickerItem} label={"2"} value={2} />
                            <Picker.Item style={globalStyles.picker.pickerItem} label={"3"} value={3} />
                            <Picker.Item style={globalStyles.picker.pickerItem} label={"4"} value={4} />
                            <Picker.Item style={globalStyles.picker.pickerItem} label={"5"} value={5} />
                        </Picker>
                    </View>
                    {loading ? (<ActivityIndicator size='large' color={globalStyleVariables.textColor} />) :
                        (
                            <View style={globalStyles.rowSpacingWrapper}>
                                <TouchableOpacity style={globalStyles.button} onPress={() => addData()}>
                                    <Text style={globalStyles.buttonTitle}>Log Soreness</Text>
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

export default LogSorenessScreen;