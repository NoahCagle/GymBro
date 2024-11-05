import { View, Text } from 'react-native'
import React from 'react'
import { globalStyles } from '../../styles/styles'

function WorkoutsScreen() {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.screenTitle}>Workouts</Text>
    </View>
  )
}

export default WorkoutsScreen