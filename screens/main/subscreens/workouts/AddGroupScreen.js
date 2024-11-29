import { View, Text, TextInput, KeyboardAvoidingView, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { globalStyles, globalStyleVariables } from '../../../../styles/styles';
import { TouchableOpacity } from 'react-native';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../../../firebase/FirebaseConfig';

function AddGroupScreen({ navigation }) {
    const [groupName, setGroupName] = useState("");
    const [loading, setLoading] = useState(false);
    const docRef = doc(db, "workouts", auth.currentUser.uid);

    const addData = async () => {
        if (groupName == "")
            alert("Your group needs a name!");
        else {
            setLoading(true);
            try {
                const snapshot = await getDoc(docRef);
                if (snapshot.exists()) {
                    let groups = snapshot.data().groups;
                    let nextId;
                    if (groups.length == 0) {
                        nextId = 0;
                    } else {
                       nextId = groups[groups.length - 1].id + 1;
                    }
                    if (groupNameAlreadyExists(groups)) {
                        alert("Group with that name already exists!")
                    } else {
                        let toLog = { name: groupName, id: nextId };
                        groups = [...groups, toLog];
                        await updateDoc(docRef, { groups: groups });
                        navigation.goBack();
                    }
                }


            } catch (error) {
                alert(error.message);
                setLoading(false);
            }
        }
    }

    const groupNameAlreadyExists = (groups) => {
        for (let i = 0; i < groups.length; i++) {
            if (groups[i].name == groupName) return true;
        }
        return false;
    }

    return (
        <View style={globalStyles.container}>
            <KeyboardAvoidingView>
                <Text style={globalStyles.screenTitle}>Create Group</Text>
                <View style={globalStyles.formWrapper}>
                    <TextInput style={globalStyles.textInput} placeholder="Group Name" placeholderTextColor={globalStyleVariables.outlineColor} autoCapitalize={"words"} value={groupName} onChangeText={(text) => setGroupName(text)} />
                    {loading ? (<ActivityIndicator size='large' color={globalStyleVariables.textColor} />) :
                        (
                            <View style={globalStyles.rowSpacingWrapper}>
                                <TouchableOpacity style={globalStyles.button} onPress={() => addData()}>
                                    <Text style={globalStyles.buttonTitle}>Add Group</Text>
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

export default AddGroupScreen;