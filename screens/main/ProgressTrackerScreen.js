import { View, Text } from 'react-native'
import React from 'react'
import { globalStyles } from '../../styles/styles';

function ProgressTrackerScreen() {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.screenTitle}>Progress Tracker</Text>
    </View>
  )
}

export default ProgressTrackerScreen;