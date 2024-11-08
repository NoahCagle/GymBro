import { View, ScrollView, ActivityIndicator } from 'react-native'
import React, { useCallback, useState } from 'react'
import { globalStyles, globalStyleVariables } from '../../styles/styles'
import { FAB } from '@rneui/themed'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AddWorkoutScreen from './subscreens/workouts/AddWorkoutScreen'
import WorkoutListItem from '../../components/workouts/WorkoutListItem'
import { useFocusEffect } from '@react-navigation/native'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '../../firebase/FirebaseConfig'

const Stack = createNativeStackNavigator();

function WorkoutsHome({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [workouts, setWorkouts] = useState([]);
  const docRef = doc(db, "workouts", auth.currentUser.uid);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        setLoading(true);
        try {
          const snapshot = await getDoc(docRef);
          if (snapshot.exists()) {
            setWorkouts(snapshot.data().workouts);
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
            workouts != [] && workouts != undefined ?
              workouts.map((wkout, index) => {
                return (<WorkoutListItem key={index} name={wkout.name} navigation={navigation} sets={wkout.sets} reps={wkout.reps} weight={wkout.weight} deleteAction={() => deleteWorkout(index)} />)
              })
              : (<Text style={globalStyles.screenSubtitle}>No workouts added yet!</Text>)
        }
      </ScrollView>
      <FAB
        visible={true}
        placement='right'
        title={"Add Workout"}
        color={globalStyleVariables.fabColor}
        onPress={() => navigation.navigate("AddWorkout")}
      />
    </View>
  )
}

function WorkoutsNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="WorkoutsNavigator" component={WorkoutsHome} options={{ headerShown: false }} />
      <Stack.Screen name="AddWorkout" component={AddWorkoutScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

export default WorkoutsNavigator