import { View, ScrollView, ActivityIndicator, Text } from 'react-native'
import React, { useCallback, useState } from 'react'
import { FAB } from '@rneui/themed'
import { useFocusEffect } from '@react-navigation/native'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { globalStyles, globalStyleVariables } from '../../../../styles/styles'
import WorkoutListItem from '../../../../components/workouts/WorkoutListItem'
import { auth, db } from '../../../../firebase/FirebaseConfig'
import Collapsible from 'react-native-collapsible'
import { TouchableOpacity } from 'react-native'
import { Button } from '@rneui/base'

function WorkoutsListScreen({ navigation }) {
    const [loading, setLoading] = useState(false);
    const [workouts, setWorkouts] = useState([]);
    const [docExists, setDocExists] = useState(false);
    const [workoutsByGroup, setWorkoutsByGroup] = useState([]);
    const docRef = doc(db, "workouts", auth.currentUser.uid);

    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                setLoading(true);
                try {
                    const snapshot = await getDoc(docRef);
                    if (snapshot.exists()) {
                        setWorkouts(snapshot.data().workouts);
                        let workouts = snapshot.data().workouts;
                        let groups = snapshot.data().groups;
                        sortWorkoutsByGroup(groups, workouts);
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

    const sortWorkoutsByGroup = (gs, wkouts) => {
        let groups = gs;

        for (let i = 0; i < groups.length; i++) {
            groups[i] = { name: groups[i].name, id: groups[i].id, workouts: [] };
        }

        for (let i = 0; i < wkouts.length; i++) {
            let index = findGroupById(wkouts[i].group);
            groups[index].workouts.push(wkouts[i]);
        }

        function findGroupById(groupId) {
            for (let i = 0; i < groups.length; i++) {
                if (groups[i].id == groupId) return i;
            }
            return 1;
        }

        setWorkoutsByGroup(groups);

    }

    const findWorkoutIndexById = (id) => {
        for (let i = 0; i < workouts.length; i++) {
            if (workouts[i].id == id) return i;
        }
    }

    const deleteWorkout = async (id) => {
        let index = findWorkoutIndexById(id);
        let wkouts = [...workouts.slice(0, index), ...workouts.slice(index + 1)];
        setWorkouts(wkouts);
        await updateDoc(docRef, { workouts: wkouts });
    }

    function CollapsibleGroup(props) {
        const group = props.group;
        const [collapsed, setCollapsed] = useState(true);
        return (
            <View style={globalStyles.collapsibleWrapper}>
                <TouchableOpacity onPress={() => setCollapsed(!collapsed)}>
                    <Text style={globalStyles.screenTitle}>{collapsed ? "▼" : "▲"} {group.name}</Text>
                </TouchableOpacity>
                <Collapsible collapsed={collapsed}>
                    {
                        group.workouts.map((wkout, index) => {
                            return (<WorkoutListItem key={index} name={wkout.name} navigation={navigation} sets={wkout.sets} reps={wkout.reps} weight={wkout.weight} group={wkout.group} id={wkout.id} deleteAction={() => deleteWorkout(wkout.id)} />)
                        })
                    }
                </Collapsible>
            </View>
        )
    }

    return (
        <View style={globalStyles.container}>
            <ScrollView>
                {
                    loading ? (<ActivityIndicator size='large' color={globalStyleVariables.textColor} />) :
                        docExists ?
                            workoutsByGroup.map((group, index) => {
                                if (group.workouts.length > 0)
                                    return (<CollapsibleGroup key={index} group={group} />)
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
            <FAB
                visible={true}
                placement='left'
                title={"+   Add Group"}
                color={globalStyleVariables.fabColor}
                onPress={() => navigation.navigate("AddGroup")}
            />
        </View>
    )
}

export default WorkoutsListScreen;