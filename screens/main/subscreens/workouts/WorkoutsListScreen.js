import { View, ScrollView, ActivityIndicator, Text } from 'react-native'
import React, { useCallback, useState } from 'react'
import { FAB } from '@rneui/themed'
import { useFocusEffect } from '@react-navigation/native'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { globalStyles, globalStyleVariables } from '../../../../styles/styles'
import WorkoutListItem from '../../../../components/workouts/WorkoutListItem'
import { auth, db } from '../../../../firebase/FirebaseConfig'

function WorkoutsListScreen({ navigation }) {
    const [loading, setLoading] = useState(false);
    const [workouts, setWorkouts] = useState([]);
    const [docExists, setDocExists] = useState(false);
    const docRef = doc(db, "workouts", auth.currentUser.uid);
  
    useFocusEffect(
      useCallback(() => {
        const loadData = async () => {
          setLoading(true);
          try {
            const snapshot = await getDoc(docRef);
            if (snapshot.exists()) {
              setWorkouts(snapshot.data().workouts);
              setDocExists(true);
              setLoading(false);
            } else {
              setDocExists(false);
              setLoading(false);
            }
          } catch (error) {
            alert(error.message);
          }
        }
  
        loadData();
  
      }, [])
    )
  
    const deleteWorkout = async (index) => {
      let wkouts = [...workouts.slice(0, index), ...workouts.slice(index + 1)];
      setWorkouts(wkouts);
      await setDoc(docRef, { workouts: wkouts });
    }
  
    return (
      <View style={globalStyles.container}>
        <ScrollView>
          {
            loading ? (<ActivityIndicator size='large' color={globalStyleVariables.textColor} />) :
              docExists ?
                workouts.map((wkout, index) => {
                  return (<WorkoutListItem key={index} name={wkout.name} navigation={navigation} sets={wkout.sets} reps={wkout.reps} weight={wkout.weight} group={wkout.group} id={wkout.id} deleteAction={() => deleteWorkout(index)} />)
                })
                : (<Text style={globalStyles.formText}>No workouts added yet!</Text>)
          }
        </ScrollView>
        <FAB
          visible={true}
          placement='right'
          title={"+   Add Workout"}
          color={globalStyleVariables.fabColor}
          onPress={() => navigation.navigate("AddWorkout")}
        />
      </View>
    )
  }

export default WorkoutsListScreen;