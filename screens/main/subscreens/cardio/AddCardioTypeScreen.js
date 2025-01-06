import { View, Text, TextInput, KeyboardAvoidingView, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { globalStyles, globalStyleVariables } from '../../../../styles/styles';
import { TouchableOpacity } from 'react-native';
import { addDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../../../firebase/FirebaseConfig';

function AddCardioTypeScreen({ navigation }) {
    const [typeName, setTypeName] = useState("");
    const [loading, setLoading] = useState(false);
    const docRef = doc(db, "cardioTracker", auth.currentUser.uid);

    const addData = async () => {
        if (typeName == "")
            alert("Your cardio type needs a name!");
        else {
            setLoading(true);
            try {
                const snapshot = await getDoc(docRef);
                if (snapshot.exists()) {
                    let types = snapshot.data().types;
                    let nextId;
                    if (types.length == 0) {
                        nextId = 0;
                    } else {
                       nextId = types[types.length - 1].id + 1;
                    }
                    if (typeNameAlreadyExists(types)) {
                        alert("Cardio type with that name already exists!")
                    } else {
                        let toLog = { name: typeName, id: nextId };
                        types = [...types, toLog];
                        await updateDoc(docRef, { types: types });
                        navigation.goBack();
                    }
                } else {
                    await setDoc(docRef, {types: [{id: 1, name: "No Type"}, {id: 2, name: typeName}], sessions: []})
                    navigation.goBack();
                }


            } catch (error) {
                alert(error.message);
            }
            setLoading(false);
        }
    }

    const typeNameAlreadyExists = (types) => {
        for (let i = 0; i < types.length; i++) {
            if (types[i].name == typeName) return true;
        }
        return false;
    }

    return (
        <View style={globalStyles.container}>
            <KeyboardAvoidingView>
                <Text style={globalStyles.screenTitle}>Create Cardio Type</Text>
                <View style={globalStyles.formWrapper}>
                    <TextInput style={globalStyles.textInput} placeholder="Name" placeholderTextColor={globalStyleVariables.outlineColor} autoCapitalize={"words"} value={typeName} onChangeText={(text) => setTypeName(text)} />
                    {loading ? (<ActivityIndicator size='large' color={globalStyleVariables.textColor} />) :
                        (
                            <View style={globalStyles.rowSpacingWrapper}>
                                <TouchableOpacity style={globalStyles.button} onPress={() => addData()}>
                                    <Text style={globalStyles.buttonTitle}>Create Cardio Type</Text>
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

export default AddCardioTypeScreen;