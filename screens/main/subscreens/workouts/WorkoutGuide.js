import { View, Text, ScrollView, TextInput } from 'react-native'
import React, { useCallback, useState } from 'react'
import { globalStyles } from '../../../../styles/styles';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { addDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../../../firebase/FirebaseConfig';

function WorkoutGuide({ navigation }) {
    const route = useRoute();
    const { name, weight, sets, reps, id } = route.params;
    const [weightText, setWeightText] = useState([]);
    const [repText, setRepText] = useState([]);

    const docRef = doc(db, "workoutTracker", auth.currentUser.uid);
    const date = new Date().toLocaleDateString();

    useFocusEffect(
        useCallback(() => {
            // Create initial values for weightText and repText using the known weight and rep goals 
            // This is done to prevent weightText and repText being used while they are still null/undefined
            const initTextHandlers = () => {
                let weightInit = [];
                let repsInit = [];
                for (let i = 0; i < sets; i++) {
                    weightInit.push(weight);
                    repsInit.push(reps);
                }
                setWeightText(weightInit);
                setRepText(repsInit);
            }
            initTextHandlers();
        }, [])
    )

    const saveWorkout = async () => {
        try {
            const snapshot = await getDoc(docRef);
            if (snapshot.exists()) {
                // Add sets to current day's list of sets
            } else {
                let sets = generateSetsJSON();
                let toLog = {workouts: [{date: date, sets: sets}]};
                await setDoc(docRef, toLog);
            }
        } catch (error) {
            alert("Failed to save workout: " + error.message);
        }
    }

    const generateSetsJSON = () => {
        let ret = [];
        for (let i = 0; i < sets; i++) {
            ret.push({id: id, name: name, weight: weightText[i], reps: repText[i]});
            console.log(repText[i])
        }
        return ret;
    }

    // These functions are passed to the SetForm component as props, and assigned to the onChangeText prop of each TextInput component
    // The values of those TextInputs are stored in 'weightText' and 'repText' so they can be accessed by the WorkoutGuide component
    const weightTextHandler = (text, index) => {
        let newData = weightText;
        newData[index] = text;
        setWeightText(newData);
    }

    const repTextHandler = (text, index) => {
        let newData = repText;
        newData[index] = text;
        setRepText(newData);
    }

    return (
        <View style={globalStyles.container}>
            <ScrollView>
                <Text style={globalStyles.screenTitle}>{name}</Text>
                <Text style={globalStyles.screenSubtitle}>Rep goal: {reps}</Text>
                {
                    weightText.map((weight, index) => {
                        return (<SetForm key={index} weight={weight} index={index} weightTextHandler={(text) => weightTextHandler(text, index)} repTextHandler={(text) => repTextHandler(text, index)} />)
                    })
                }
                <View style={globalStyles.rowSpacingWrapper}>
                    <TouchableOpacity style={globalStyles.button} onPress={() => saveWorkout()}>
                        <Text style={globalStyles.buttonTitle}>Save Workout</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={globalStyles.button} onPress={() => navigation.navigate("WorkoutsNavigator")}>
                        <Text style={globalStyles.buttonTitle}>Cancel Workout</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}

function SetForm(props) {
    const weight = props.weight;
    const index = props.index;
    const weightTextHandler = props.weightTextHandler;
    const repTextHandler = props.repTextHandler;

    return (
        <View style={globalStyles.formWrapper}>
            <Text style={globalStyles.formTitle}>Set {index + 1}</Text>
            <View style={globalStyles.rowSpacingWrapper}>
                <Text style={globalStyles.textInputTitle}>Weight: </Text>
                <TextInput style={[globalStyles.textInput, { maxWidth: '80%' }]} onChangeText={weightTextHandler}>{weight}</TextInput>
            </View>
            <View style={globalStyles.rowSpacingWrapper}>
                <Text style={globalStyles.textInputTitle}>Reps:     </Text>
                <TextInput style={[globalStyles.textInput, { maxWidth: '80%' }]} onChangeText={repTextHandler}></TextInput>
            </View>
        </View>
    )

}

export default WorkoutGuide;