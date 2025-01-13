import { View, Text, ScrollView, TextInput, ActivityIndicator } from 'react-native'
import React, { useCallback, useState } from 'react'
import { globalStyles, globalStyleVariables } from '../../../../styles/styles';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../../../firebase/FirebaseConfig';
import { blankDate, cloneObject } from '../../../../data/DataStructures';

function WorkoutGuide({ navigation }) {
    const route = useRoute();
    const { name, weight, sets, reps, id } = route.params;
    const [weightText, setWeightText] = useState([]);
    const [repText, setRepText] = useState([]);

    const [loading, setLoading] = useState(false);

    const docRef = doc(db, "dataTracker", auth.currentUser.uid);
    const date = new Date().toLocaleDateString();

    useFocusEffect(
        useCallback(() => {
            // Create initial blank values for weightText and repText using the known weight and rep goals 
            // This is done to prevent weightText and repText being used while they are still null/undefined
            const initTextHandlers = () => {
                let weightInit = [];
                let repsInit = [];
                // sets is the initial number of sets defined when the workout was originally created
                // however, as sets are added or deleted, weightText.length become the accurate reading of the number of sets to save
                for (let i = 0; i < sets; i++) {
                    weightInit.push("" + weight);
                    repsInit.push("");
                }
                setWeightText(weightInit);
                setRepText(repsInit);
            }

            initTextHandlers();
        }, [])
    )

    const saveWorkout = async () => {
        setLoading(true);
        try {
            const newSets = generateSetsJSON();
            const snapshot = await getDoc(docRef);
            if (snapshot.exists()) {
                const data = snapshot.data();
                let dates = [...data.dates];
                const dateIndex = findCurrentDateIndex(dates);
                if (dateIndex != -1) {
                    const appended = [...dates[dateIndex].sets, ...newSets];
                    dates[dateIndex].sets = appended;
                    await updateDoc(docRef, { dates: dates });
                } else {
                    let newDate = cloneObject(blankDate);
                    newDate.sets = newSets;
                    dates.push(newDate);
                    await updateDoc(docRef, { dates: dates });
                }
            } else {
                let newDate = cloneObject(blankDate);
                newDate.sets = newSets;
                await setDoc(docRef, { dates: [newDate] })
            }

            setLoading(false);
            navigation.goBack();

        } catch (error) {
            alert("Failed to save workout: " + error.message);
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

    const generateSetsJSON = () => {
        let ret = [];
        // weightText.length is used instead of 'sets' because weightText.length represents the actual number of sets the user wishes to record
        for (let i = 0; i < weightText.length; i++) {
            ret.push({ date: date, workoutId: id, name: name, weight: parseFloat(weightText[i]), reps: parseFloat(repText[i]) });
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

    // Adds a new, empty entry to the end of weightText and repText, such that another SetForm component will be rendered
    const addSet = () => {
        setWeightText([...weightText, weight]);
        setRepText([...repText, ""]);
    }

    // Removes the element at 'index' in both weightText and repText array
    const deleteSet = (index) => {
        setWeightText([...weightText.slice(0, index), ...weightText.slice(index + 1)]);
        setRepText([...repText.slice(0, index), ...repText.slice(index + 1)]);
    }

    return (
        <View style={globalStyles.container}>
            <ScrollView>
                <Text style={globalStyles.screenTitle}>{name}</Text>
                <Text style={globalStyles.screenSubtitle}>Rep goal: {reps}</Text>
                {
                    // Maps based on the initial value of weightText.length since weightText.length == sets
                    weightText.map((w, index) => {
                        return (<SetForm key={index} weight={weightText[index]} initReps={repText[index]} index={index} weightTextHandler={(text) => weightTextHandler(text, index)} repTextHandler={(text) => repTextHandler(text, index)} deleteAction={() => deleteSet(index)} />)
                    })
                }
                <View style={globalStyles.rowSpacingWrapper}>
                    <TouchableOpacity style={globalStyles.button} onPress={() => addSet()}>
                        <Text style={globalStyles.buttonTitle}>+ Extra Set</Text>
                    </TouchableOpacity>
                </View>
                {
                    loading ? (<ActivityIndicator size='large' color={globalStyleVariables.textColor} />) : (
                        <View style={globalStyles.rowSpacingWrapper}>
                            <TouchableOpacity style={globalStyles.button} onPress={() => saveWorkout()}>
                                <Text style={globalStyles.buttonTitle}>Save Workout</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={globalStyles.button} onPress={() => navigation.goBack()}>
                                <Text style={globalStyles.buttonTitle}>Cancel Workout</Text>
                            </TouchableOpacity>
                        </View>
                    )}
            </ScrollView>
        </View>
    )
}

function SetForm(props) {
    const weight = props.weight;
    const initReps = props.initReps;
    const index = props.index;
    const weightTextHandler = props.weightTextHandler;
    const repTextHandler = props.repTextHandler;
    const deleteAction = props.deleteAction;

    return (
        <View style={globalStyles.formWrapper}>
            <Text style={globalStyles.formTitle}>Set {index + 1}</Text>
            <View style={globalStyles.rowSpacingWrapper}>
                <Text style={globalStyles.textInputTitle}>Weight: </Text>
                <TextInput style={[globalStyles.textInput, { maxWidth: '80%' }]} onChangeText={weightTextHandler}>{weight}</TextInput>
            </View>
            <View style={globalStyles.rowSpacingWrapper}>
                <Text style={globalStyles.textInputTitle}>Reps:     </Text>
                <TextInput style={[globalStyles.textInput, { maxWidth: '80%' }]} onChangeText={repTextHandler}>{initReps}</TextInput>
            </View>
            <View style={globalStyles.rowSpacingWrapper}>
                <TouchableOpacity style={globalStyles.button} onPress={deleteAction}>
                    <Text style={globalStyles.buttonTitle}>Delete set</Text>
                </TouchableOpacity>
            </View>
        </View>
    )

}

export default WorkoutGuide;