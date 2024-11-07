import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { globalStyles, globalStyleVariables } from '../../styles/styles'
import { FAB } from '@rneui/themed'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AddWorkoutScreen from './subscreens/workouts/AddWorkoutScreen'
import { TouchableOpacity } from 'react-native-gesture-handler'

const Stack = createNativeStackNavigator();

function WorkoutsHome({ navigation }) {
  return (
    <View style={globalStyles.container}>
      <ScrollView>
        <View style={globalStyles.formWrapper}>
          <Text style={globalStyles.formTitle}>Barbell Bench Press</Text>
          <Text style={globalStyles.formText}>3 sets of 10 at 225 lbs</Text>
          <View style={globalStyles.formButtonRowWrapper}>
            <TouchableOpacity style={globalStyles.button}>
              <Text style={globalStyles.buttonTitle}>Play</Text>
            </TouchableOpacity>
            <TouchableOpacity style={globalStyles.button}>
              <Text style={globalStyles.buttonTitle}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={globalStyles.button}>
              <Text style={globalStyles.buttonTitle}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <FAB
        visible={true}
        placement='right'
        icon={{ name: 'add', color: 'white' }}
        title={"Add Workout"}
        color={globalStyleVariables.fabColor}
        onPress={() => navigation.navigate('AddWorkout')}
      />
    </View>
  )
}

function WorkoutsNavigator({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name='WorkoutsHome' component={WorkoutsHome} options={{ headerShown: false }} />
      <Stack.Screen name='AddWorkout' component={AddWorkoutScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

export default WorkoutsNavigator