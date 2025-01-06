import { Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { globalStyles } from '../../styles/styles'

function SorenessTrackerNavigator() {
    const date = new Date().toLocaleDateString();

    return (
        <View style={globalStyles.container}>

            <View style={globalStyles.formWrapper}>
                <Text style={globalStyles.formTitle}>Soreness History</Text>
                <View style={globalStyles.rowSpacingWrapper}>
                    <Text style={globalStyles.formSubtitle}>Today's date: {date}</Text>

                    <TouchableOpacity style={globalStyles.button}>
                        <Text style={globalStyles.buttonTitle}>Log soreness</Text>
                    </TouchableOpacity>

                </View>
            </View>

        </View>
    )
}

export default SorenessTrackerNavigator