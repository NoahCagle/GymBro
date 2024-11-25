import { View, Text } from 'react-native'
import React from 'react'
import { globalStyles, globalStyleVariables } from '../../../../styles/styles';
import { FAB } from '@rneui/base';

function GroupManagerScreen({ navigation }) {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.screenTitle}>GroupManager</Text>
      <FAB
          visible={true}
          placement='right'
          title={"+   Add Group"}
          color={globalStyleVariables.fabColor}
          onPress={() => navigation.navigate("AddGroup")}
        />
    </View>
  )
}

export default GroupManagerScreen;