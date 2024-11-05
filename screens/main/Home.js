import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { globalStyles } from '../../styles/styles'

function Home() {
    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.screenTitle}>Home</Text>
        </View>
    )
}

export default Home