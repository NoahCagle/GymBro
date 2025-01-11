import { Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ImageLogo, { globalStyles } from '../../styles/styles'

function HomeNavigator({ navigation }) {

    return (
        <View style={[globalStyles.container, { justifyContent: 'center' }]}>

        <ImageLogo width={256} height={128}/>

            <Text style={globalStyles.screenSubtitle}>What are we doing today?</Text>

            <View style={globalStyles.rowSpacingWrapper}>

                <TouchableOpacity style={globalStyles.button} onPress={() => navigation.navigate("Workouts")}>
                    <Text style={globalStyles.buttonTitle}>Start a Workout</Text>
                </TouchableOpacity>

                <TouchableOpacity style={globalStyles.button} onPress={() => navigation.navigate("Cardio")}>
                    <Text style={globalStyles.buttonTitle}>Log Cardio</Text>
                </TouchableOpacity>

            </View>

            <View style={globalStyles.rowSpacingWrapper}>

                <TouchableOpacity style={globalStyles.button} onPress={() => navigation.navigate("Progress Tracker")}>
                    <Text style={globalStyles.buttonTitle}>Manage Progress</Text>
                </TouchableOpacity>

                <TouchableOpacity style={globalStyles.button} onPress={() => navigation.navigate("Sleep Tracker")}>
                    <Text style={globalStyles.buttonTitle}>Log Sleep</Text>
                </TouchableOpacity>

            </View>
        </View>
    )
}

export default HomeNavigator