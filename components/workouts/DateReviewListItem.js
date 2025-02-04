import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { globalStyles, globalStyleVariables } from '../../styles/styles';
import Collapsible from 'react-native-collapsible';
import { fullDateName } from '../calendar/DateFormatting';

function DateReviewListItem(props) {
    const dateData = props.dateData;
    const navigation = props.navigation;

    // Organizes list of sets and groups them by their workoutId
    function separateSets() {
        let workouts = []; // {name: "", workoutId: -1, sets: []}
        for (let i = 0; i < dateData.sets.length; i++) {
            let set = dateData.sets[i];
            let foundExisting = false;
            for (let j = 0; j < workouts.length; j++) {
                if (workouts[j].workoutId == set.workoutId) {
                    workouts[j].sets.push(set);
                    foundExisting = true;
                    break;
                }
            }

            if (!foundExisting) {
                workouts.push({ name: set.name, workoutId: set.workoutId, sets: [set] });
            }

        }

        return workouts;

    }

    const showSleepLog = () => {
        if (dateData.sleepLog != null)
            return (
                <View style={globalStyles.collapsibleWrapper}>
                    <Text style={[globalStyles.formSubtitle, { textAlign: 'left', alignSelf: 'left' }]}> - Logged {dateData.sleepLog.hours} hours of sleep</Text>
                </View>
            )
    }

    const showBodyWeightLog = () => {
        if (dateData.bodyWeightLogs.length != 0)
            return (
                <View style={globalStyles.collapsibleWrapper}>
                    <Text style={[globalStyles.formSubtitle, { textAlign: 'left', alignSelf: 'left' }]}>- Weighed in at {dateData.bodyWeightLogs[0].weight} lbs</Text>
                </View>
            )
    }

    const organizedSets = separateSets();

    return (
        <View style={globalStyles.formWrapper}>
        <Text style={globalStyles.formTitle}>{fullDateName(dateData.date)}</Text>
            <View style={globalStyles.rowSpacingWrapper}>
                <TouchableOpacity style={globalStyles.button} onPress={() => navigation.navigate("DayBreakdown", { date: dateData, organizedSets: organizedSets })}>
                    <Text style={globalStyles.buttonTitle}>Complete Breakdown</Text>
                </TouchableOpacity>
            </View>
            {
                showSleepLog()
            }
            {
                showBodyWeightLog()
            }
            {
                organizedSets.map((workout, index) => {
                    return (
                        <CollapsibleSetList key={index} data={workout} />
                    )
                })
            }
            {
                dateData.cardioLogs.map((session, index) => {
                    return (
                        <CollapsibleCardioItem key={index} data={session} />
                    )
                })
            }

        </View>
    )
}

function CollapsibleSetList(props) {
    const [collapsed, setCollapsed] = useState(true);
    const data = props.data;
    return (
        <View style={globalStyles.collapsibleWrapper}>
            <TouchableOpacity onPress={() => setCollapsed(!collapsed)}>
                <Text style={[globalStyles.formSubtitle, { textAlign: 'left', alignSelf: 'left' }]}>{collapsed ? "▼" : "▲"} {data.name}: {data.sets.length} sets</Text>
            </TouchableOpacity>
            <Collapsible collapsed={collapsed}>
                {
                    data.sets.map((set, index) => {
                        return (
                            <Text key={index} style={[globalStyles.formText]}>- {set.reps} reps at {set.weight} lbs</Text>
                        )
                    })
                }
            </Collapsible>
        </View>
    )
}

function CollapsibleCardioItem(props) {
    const [collapsed, setCollapsed] = useState(true);
    const data = props.data;
    return (
        <View style={globalStyles.collapsibleWrapper}>
            <TouchableOpacity onPress={() => setCollapsed(!collapsed)}>
                <Text style={[globalStyles.formSubtitle, { textAlign: 'left', alignSelf: 'left' }]}>{collapsed ? "▼" : "▲"} Cardio: {data.typeName}</Text>
            </TouchableOpacity>
            <Collapsible collapsed={collapsed}>
                <Text style={[globalStyles.formText]}>- Went for {data.time} minutes</Text>
                <Text style={[globalStyles.formText]}>- Burned {data.caloriesBurned} calories</Text>
            </Collapsible>
        </View>
    )
}

export default DateReviewListItem;